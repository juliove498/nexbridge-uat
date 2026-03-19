/**
 * POST /api/admin/login
 *
 * 1. Zod validation
 * 2. Rate limit (DB-backed, 15-min window)
 * 3. Lookup user in admin_users
 * 4. PBKDF2 verify (always runs to prevent timing oracle)
 * 5. Create opaque session, deliver via HttpOnly cookie
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import { setAdminCors } from '../lib/cors'
import { isRateLimited, recordFailedAttempt, recordSuccessfulLogin, getClientIp } from '../lib/rate-limit'
import { verifyPassword } from '../lib/password'
import { createSession } from '../lib/sessions'
import { authCookieHeader } from '../lib/auth'
import { getDb } from '../lib/db'

const schema = z.object({
  email:    z.string().email().max(255),
  password: z.string().min(8).max(128),
})

// Placeholder hash used when the user doesn't exist — ensures PBKDF2 always runs
const DUMMY_HASH =
  'a'.repeat(32) + ':' + 'b'.repeat(128)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!setAdminCors(req, res, ['POST', 'OPTIONS'])) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input', issues: parsed.error.issues })

  const { email, password } = parsed.data
  const ip = getClientIp(req)

  const { limited, retryAfterSeconds } = await isRateLimited(email, ip)
  if (limited) {
    res.setHeader('Retry-After', String(retryAfterSeconds))
    return res.status(429).json({ error: 'Too many failed attempts. Try again later.', retryAfterSeconds })
  }

  const sql = getDb()
  const users = await sql<{ password_hash: string; role: string; name: string | null }[]>`
    SELECT password_hash, role, name FROM admin_users WHERE email = ${email} LIMIT 1
  `

  const storedHash = users[0]?.password_hash ?? DUMMY_HASH
  const valid = await verifyPassword(password, storedHash)

  if (!valid || !users.length) {
    await recordFailedAttempt(email, ip, password)
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const { role, name } = users[0]
  const ua = req.headers['user-agent'] ?? ''
  const token = await createSession(email, role, name, ip, ua)
  await recordSuccessfulLogin(email, ip)

  res.setHeader('Set-Cookie', authCookieHeader(token))
  return res.status(200).json({ ok: true, email, role, name })
}
