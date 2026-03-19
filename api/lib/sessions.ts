/**
 * Opaque session management (admin_sessions table).
 *
 * Token: 32 random bytes → hex, sent via HttpOnly cookie.
 * Only the SHA-256 hash is persisted — the raw token is never stored.
 * TTL: 2h absolute + 15min inactivity. UA fingerprint prevents cross-browser token reuse.
 */

import { createHash, randomBytes } from 'node:crypto'
import { getDb } from './db'

const SESSION_TTL_MS = 2 * 60 * 60 * 1000      // 2 hours
const INACTIVITY_MS  = 15 * 60 * 1000           // 15 minutes

const hashToken = (t: string) => createHash('sha256').update(t).digest('hex')
const hashUA    = (ua: string) => createHash('sha256').update(ua).digest('hex')

export interface SessionData {
  id: number
  user_email: string
  user_role: string
  user_name: string | null
  ip: string | null
  last_seen_at: Date
  created_at: Date
}

export async function createSession(
  email: string, role: string, name: string | null, ip: string, userAgent: string,
): Promise<string> {
  const sql = getDb()
  const token    = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
  await sql`
    INSERT INTO admin_sessions
      (token_hash, user_email, user_role, user_name, ip, user_agent, ua_hash, expires_at)
    VALUES
      (${hashToken(token)}, ${email}, ${role}, ${name}, ${ip}, ${userAgent}, ${hashUA(userAgent)}, ${expiresAt})
  `
  return token
}

export async function validateSession(token: string, userAgent: string): Promise<SessionData | null> {
  const sql = getDb()
  const rows = await sql<(SessionData & { ua_hash: string })[]>`
    SELECT id, user_email, user_role, user_name, ip, last_seen_at, created_at, ua_hash
    FROM admin_sessions
    WHERE token_hash = ${hashToken(token)}
      AND revoked_at IS NULL
      AND expires_at > NOW()
    LIMIT 1
  `
  if (!rows.length) return null
  const s = rows[0]

  if (Date.now() - new Date(s.last_seen_at).getTime() > INACTIVITY_MS) {
    sql`UPDATE admin_sessions SET revoked_at = NOW() WHERE id = ${s.id}`.catch(() => {})
    return null
  }
  if (s.ua_hash !== hashUA(userAgent)) return null

  // fire-and-forget touch
  sql`UPDATE admin_sessions SET last_seen_at = NOW() WHERE id = ${s.id}`.catch(() => {})

  const { ua_hash: _, ...clean } = s
  return clean
}

export async function revokeSessionByToken(token: string): Promise<void> {
  await getDb()`UPDATE admin_sessions SET revoked_at = NOW() WHERE token_hash = ${hashToken(token)} AND revoked_at IS NULL`
}

export async function revokeSession(id: number): Promise<void> {
  await getDb()`UPDATE admin_sessions SET revoked_at = NOW() WHERE id = ${id} AND revoked_at IS NULL`
}

export async function revokeAllSessions(email: string, exceptId?: number): Promise<void> {
  const sql = getDb()
  if (exceptId !== undefined) {
    await sql`UPDATE admin_sessions SET revoked_at = NOW() WHERE user_email = ${email} AND id != ${exceptId} AND revoked_at IS NULL`
  } else {
    await sql`UPDATE admin_sessions SET revoked_at = NOW() WHERE user_email = ${email} AND revoked_at IS NULL`
  }
}

export async function listActiveSessions(email: string) {
  return getDb()`
    SELECT id, ip, user_agent, created_at, last_seen_at, expires_at
    FROM admin_sessions
    WHERE user_email = ${email} AND revoked_at IS NULL AND expires_at > NOW()
    ORDER BY last_seen_at DESC
  `
}
