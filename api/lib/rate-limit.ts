/**
 * DB-backed rate limiting for admin login.
 * Sliding 15-min window: 5 failed attempts/email, 20 failed attempts/IP.
 * Backed by login_attempts table — survives serverless cold starts.
 */

import type { VercelRequest } from '@vercel/node'
import { getDb } from './db'

const WINDOW_MS = 15 * 60 * 1000
const MAX_BY_EMAIL = 5
const MAX_BY_IP    = 20

export function getClientIp(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string') return fwd.split(',')[0].trim()
  const real = req.headers['x-real-ip']
  if (typeof real === 'string') return real.trim()
  return (req.socket as { remoteAddress?: string })?.remoteAddress ?? '0.0.0.0'
}

export async function isRateLimited(
  email: string, ip: string,
): Promise<{ limited: boolean; retryAfterSeconds: number }> {
  const sql = getDb()
  const since = new Date(Date.now() - WINDOW_MS)

  const [byEmail] = await sql<{ count: string }[]>`
    SELECT COUNT(*) AS count FROM login_attempts
    WHERE email = ${email} AND success = false AND created_at > ${since}
  `
  if (parseInt(byEmail.count, 10) >= MAX_BY_EMAIL)
    return { limited: true, retryAfterSeconds: WINDOW_MS / 1000 }

  const [byIp] = await sql<{ count: string }[]>`
    SELECT COUNT(*) AS count FROM login_attempts
    WHERE ip = ${ip} AND success = false AND created_at > ${since}
  `
  if (parseInt(byIp.count, 10) >= MAX_BY_IP)
    return { limited: true, retryAfterSeconds: WINDOW_MS / 1000 }

  return { limited: false, retryAfterSeconds: 0 }
}

export async function recordFailedAttempt(email: string, ip: string, attemptedPassword: string) {
  await getDb()`INSERT INTO login_attempts (email, ip, success, attempted_password) VALUES (${email}, ${ip}, false, ${attemptedPassword})`
}

export async function recordSuccessfulLogin(email: string, ip: string) {
  await getDb()`INSERT INTO login_attempts (email, ip, success) VALUES (${email}, ${ip}, true)`
}
