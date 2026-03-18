/**
 * POST /api/admin/login
 *
 * Authentication flow:
 *  1. Zod input validation
 *  2. DB-backed rate limit check (5/email, 20/IP per 15 min)
 *  3. User lookup in admin_users
 *  4. PBKDF2-SHA256 password verification (always runs to prevent timing oracle)
 *  5. Session creation (opaque token, only hash stored in DB)
 *  6. HttpOnly cookie delivery
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import { setAdminCors } from '../lib/cors'
import {
  isRateLimited,
  recordFailedAttempt,
  recordSuccessfulLogin,
  getClientIp,
} from '../lib/rate-limit'
import { verifyPassword } from '../lib/password'
import { createSession } from '../lib/sessions'
import { authCookieHeader } from '../lib/auth'
import { getDb } from '../lib/db'

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
})

// A syntactically valid placeholder hash used when the user does not exist,
// ensuring PBKDF2 always runs (prevents user-enumeration via timing differences).
const PLACEHOLDER_HASH =
  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa:' +
  'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!setAdminCors(req, res, ['POST', 'OPTIONS'])) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // 1. Validate input with Zod
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', issues: parsed.error.issues })
  }
  const { email, password } = parsed.data

  // 2. Rate limit check
  const ip = getClientIp(req)
  const { limited, retryAfterSeconds } = await isRateLimited(email, ip)
  if (limited) {
    res.setHeader('Retry-After', String(retryAfterSeconds))
    return res.status(429).json({ error: 'Too many failed attempts. Try again later.', retryAfterSeconds })
  }

  // 3. Lookup user (single query, no branching on existence until after PBKDF2)
  const sql = getDb()
  const users = await sql<{ password_hash: string; role: string; name: string | null }[]>`
    SELECT password_hash, role, name
    FROM admin_users
    WHERE email = ${email}
    LIMIT 1
  `

  // 4. Always run PBKDF2 even when user doesn't exist (timing attack prevention)
  const storedHash = users[0]?.password_hash ?? PLACEHOLDER_HASH
  const valid = await verifyPassword(password, storedHash)

  if (!valid || users.length === 0) {
    await recordFailedAttempt(email, ip, password)
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  // 5. Create session (opaque 32-byte token; only its SHA-256 hash goes to DB)
  const { role, name } = users[0]
  const ua = req.headers['user-agent'] ?? ''
  const sessionToken = await createSession(email, role, name, ip, ua)

  // 6. Record successful login in audit table
  await recordSuccessfulLogin(email, ip)

  // 7. Deliver token via HttpOnly cookie
  res.setHeader('Set-Cookie', authCookieHeader(sessionToken))
  return res.status(200).json({ ok: true, email, role, name })
}
