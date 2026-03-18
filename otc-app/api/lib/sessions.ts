/**
 * Opaque session management backed by PostgreSQL (admin_sessions table).
 *
 * - Token: 32 random bytes → hex string, returned to client via HttpOnly cookie
 * - Storage: only the SHA-256 hash of the token is persisted (never the token itself)
 * - TTL: 2-hour absolute + 15-minute inactivity window
 * - Fingerprint: UA hash checked on every request to prevent token theft between browsers
 */

import { createHash, randomBytes } from 'node:crypto'
import { getDb } from './db'

const SESSION_TTL_SECONDS = 2 * 60 * 60       // 2 hours absolute
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000  // 15 minutes

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

function hashUA(ua: string): string {
  return createHash('sha256').update(ua).digest('hex')
}

export interface SessionData {
  id: number
  user_email: string
  user_role: string
  user_name: string | null
  ip: string | null
  last_seen_at: Date
  created_at: Date
}

/**
 * Create a new session. Returns the opaque token (not the hash).
 */
export async function createSession(
  email: string,
  role: string,
  name: string | null,
  ip: string,
  userAgent: string
): Promise<string> {
  const sql = getDb()
  const token = randomBytes(32).toString('hex')
  const tokenHash = hashToken(token)
  const uaHash = hashUA(userAgent)
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000)

  await sql`
    INSERT INTO admin_sessions
      (token_hash, user_email, user_role, user_name, ip, user_agent, ua_hash, expires_at)
    VALUES
      (${tokenHash}, ${email}, ${role}, ${name}, ${ip}, ${userAgent}, ${uaHash}, ${expiresAt})
  `
  return token
}

/**
 * Validate a session token. Returns session data or null if invalid/expired/revoked.
 * Automatically revokes sessions that exceed the inactivity timeout.
 * Performs a fire-and-forget touch of last_seen_at on success.
 */
export async function validateSession(
  token: string,
  userAgent: string
): Promise<SessionData | null> {
  const sql = getDb()
  const tokenHash = hashToken(token)

  const rows = await sql<(SessionData & { ua_hash: string })[]>`
    SELECT id, user_email, user_role, user_name, ip, last_seen_at, created_at, ua_hash
    FROM admin_sessions
    WHERE token_hash = ${tokenHash}
      AND revoked_at IS NULL
      AND expires_at > NOW()
    LIMIT 1
  `
  if (!rows.length) return null

  const session = rows[0]

  // Inactivity check
  if (Date.now() - new Date(session.last_seen_at).getTime() > INACTIVITY_TIMEOUT_MS) {
    // Revoke silently — session timed out due to inactivity
    sql`UPDATE admin_sessions SET revoked_at = NOW() WHERE id = ${session.id}`.catch(() => {})
    return null
  }

  // Fingerprint check — prevents stolen tokens from being used on a different browser
  if (session.ua_hash !== hashUA(userAgent)) return null

  // Touch last_seen_at (fire-and-forget, non-blocking)
  sql`UPDATE admin_sessions SET last_seen_at = NOW() WHERE id = ${session.id}`.catch(() => {})

  const { ua_hash: _discard, ...clean } = session
  return clean
}

/** Revoke a session by its opaque token. */
export async function revokeSessionByToken(token: string): Promise<void> {
  const sql = getDb()
  const tokenHash = hashToken(token)
  await sql`
    UPDATE admin_sessions SET revoked_at = NOW()
    WHERE token_hash = ${tokenHash} AND revoked_at IS NULL
  `
}

/** Revoke a session by its numeric ID. */
export async function revokeSession(id: number): Promise<void> {
  const sql = getDb()
  await sql`
    UPDATE admin_sessions SET revoked_at = NOW()
    WHERE id = ${id} AND revoked_at IS NULL
  `
}

/** Revoke all active sessions for a user, optionally sparing one (e.g. current). */
export async function revokeAllSessions(email: string, exceptId?: number): Promise<void> {
  const sql = getDb()
  if (exceptId !== undefined) {
    await sql`
      UPDATE admin_sessions SET revoked_at = NOW()
      WHERE user_email = ${email} AND id != ${exceptId} AND revoked_at IS NULL
    `
  } else {
    await sql`
      UPDATE admin_sessions SET revoked_at = NOW()
      WHERE user_email = ${email} AND revoked_at IS NULL
    `
  }
}

/** List all active (non-revoked, non-expired) sessions for a user. */
export async function listActiveSessions(email: string) {
  const sql = getDb()
  return sql`
    SELECT id, ip, user_agent, created_at, last_seen_at, expires_at
    FROM admin_sessions
    WHERE user_email = ${email}
      AND revoked_at IS NULL
      AND expires_at > NOW()
    ORDER BY last_seen_at DESC
  `
}
