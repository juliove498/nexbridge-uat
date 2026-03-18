/**
 * Cookie and authentication helpers for the admin API.
 *
 * Cookie attributes:
 *   admin_token=<token>; HttpOnly; Secure; SameSite=Strict; Path=/api/admin; Max-Age=7200
 *
 * - HttpOnly: inaccessible from JavaScript (XSS protection)
 * - Secure: only sent over HTTPS
 * - SameSite=Strict: never sent on cross-origin requests (CSRF protection)
 * - Path=/api/admin: scoped to admin endpoints only
 */

import type { VercelRequest } from '@vercel/node'
import { validateSession, type SessionData } from './sessions'

const COOKIE_NAME = 'admin_token'
const COOKIE_MAX_AGE = 7200 // seconds — 2 hours, aligned with session TTL

/** Parse a raw Cookie header string into a key→value map. */
export function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {}
  return Object.fromEntries(
    header.split(';').flatMap(chunk => {
      const eqIdx = chunk.indexOf('=')
      if (eqIdx === -1) return []
      const key = chunk.slice(0, eqIdx).trim()
      const value = chunk.slice(eqIdx + 1).trim()
      try {
        return [[key, decodeURIComponent(value)]]
      } catch {
        return [[key, value]]
      }
    })
  )
}

/** Extract the opaque session token from the request cookie. */
export function getTokenFromRequest(req: VercelRequest): string | null {
  const cookies = parseCookies(req.headers.cookie)
  return cookies[COOKIE_NAME] ?? null
}

/**
 * Full authentication check: extract token → validate in DB → verify UA fingerprint.
 * Returns session data or null if the request is not authenticated.
 */
export async function verifyAuth(req: VercelRequest): Promise<SessionData | null> {
  const token = getTokenFromRequest(req)
  if (!token) return null
  const ua = req.headers['user-agent'] ?? ''
  return validateSession(token, ua)
}

/** Build the Set-Cookie header to deliver the session token. */
export function authCookieHeader(token: string, maxAge = COOKIE_MAX_AGE): string {
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/api/admin; Max-Age=${maxAge}`
}

/** Build the Set-Cookie header to clear the session cookie on logout. */
export function clearAuthCookieHeader(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/api/admin; Max-Age=0`
}
