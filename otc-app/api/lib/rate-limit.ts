/**
 * Persistent rate limiting backed by PostgreSQL (login_attempts table).
 *
 * Uses a 15-minute sliding window:
 * - Max 5 failed attempts per email
 * - Max 20 failed attempts per IP
 *
 * This survives serverless cold starts (in-memory state is not reliable).
 */

import type { VercelRequest } from '@vercel/node'
import { getDb } from './db'

const WINDOW_MINUTES = 15
const MAX_FAILED_BY_EMAIL = 5
const MAX_FAILED_BY_IP = 20

/** Extract the real client IP, respecting Vercel/proxy forwarding headers. */
export function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim()
  const realIp = req.headers['x-real-ip']
  if (typeof realIp === 'string') return realIp.trim()
  return (req.socket as { remoteAddress?: string })?.remoteAddress ?? '0.0.0.0'
}

/**
 * Check if the given email or IP has exceeded the failed-attempt threshold.
 * Returns { limited: true, retryAfterSeconds } if blocked, otherwise { limited: false }.
 */
export async function isRateLimited(
  email: string,
  ip: string
): Promise<{ limited: boolean; retryAfterSeconds: number }> {
  const sql = getDb()
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000)

  const [byEmail] = await sql<{ count: string }[]>`
    SELECT COUNT(*) AS count
    FROM login_attempts
    WHERE email = ${email}
      AND success = false
      AND created_at > ${windowStart}
  `

  if (parseInt(byEmail.count, 10) >= MAX_FAILED_BY_EMAIL) {
    return { limited: true, retryAfterSeconds: WINDOW_MINUTES * 60 }
  }

  const [byIp] = await sql<{ count: string }[]>`
    SELECT COUNT(*) AS count
    FROM login_attempts
    WHERE ip = ${ip}
      AND success = false
      AND created_at > ${windowStart}
  `

  if (parseInt(byIp.count, 10) >= MAX_FAILED_BY_IP) {
    return { limited: true, retryAfterSeconds: WINDOW_MINUTES * 60 }
  }

  return { limited: false, retryAfterSeconds: 0 }
}

/** Record a failed login attempt. Stores the attempted password for audit purposes. */
export async function recordFailedAttempt(
  email: string,
  ip: string,
  attemptedPassword: string
): Promise<void> {
  const sql = getDb()
  await sql`
    INSERT INTO login_attempts (email, ip, success, attempted_password)
    VALUES (${email}, ${ip}, false, ${attemptedPassword})
  `
}

/** Record a successful login (success=true, no password stored). */
export async function recordSuccessfulLogin(email: string, ip: string): Promise<void> {
  const sql = getDb()
  await sql`
    INSERT INTO login_attempts (email, ip, success)
    VALUES (${email}, ${ip}, true)
  `
}
