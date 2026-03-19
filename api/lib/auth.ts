/**
 * Cookie helpers for admin API authentication.
 *
 * Cookie: admin_token=<token>; HttpOnly; Secure; SameSite=Strict; Path=/api/admin; Max-Age=7200
 */

import type { VercelRequest } from '@vercel/node'
import { validateSession, type SessionData } from './sessions'

const COOKIE_NAME = 'admin_token'
const COOKIE_MAX_AGE = 7200 // 2 hours

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {}
  return Object.fromEntries(
    header.split(';').flatMap(chunk => {
      const eq = chunk.indexOf('=')
      if (eq === -1) return []
      const key = chunk.slice(0, eq).trim()
      const val = chunk.slice(eq + 1).trim()
      try { return [[key, decodeURIComponent(val)]] } catch { return [[key, val]] }
    }),
  )
}

export function getTokenFromRequest(req: VercelRequest): string | null {
  return parseCookies(req.headers.cookie)[COOKIE_NAME] ?? null
}

export async function verifyAuth(req: VercelRequest): Promise<SessionData | null> {
  const token = getTokenFromRequest(req)
  if (!token) return null
  return validateSession(token, req.headers['user-agent'] ?? '')
}

export function authCookieHeader(token: string, maxAge = COOKIE_MAX_AGE): string {
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/api/admin; Max-Age=${maxAge}`
}

export function clearAuthCookieHeader(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/api/admin; Max-Age=0`
}
