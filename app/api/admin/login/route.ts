import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { makeCors, authCookieValue, getClientIpFromNextReq } from '@/lib/admin-api'
import { isRateLimited, recordFailedAttempt, recordSuccessfulLogin } from '@/api/lib/rate-limit'
import { verifyPassword } from '@/api/lib/password'
import { createSession } from '@/api/lib/sessions'
import { getDb } from '@/api/lib/db'

const schema = z.object({
  email:    z.string().email().max(255),
  password: z.string().min(8).max(128),
})

// Placeholder hash so PBKDF2 always runs (prevents user-enumeration timing oracle)
const DUMMY_HASH = 'a'.repeat(32) + ':' + 'b'.repeat(128)

const METHODS = ['POST', 'OPTIONS']

export async function OPTIONS(req: NextRequest) {
  const cors = makeCors(req, METHODS)
  if (cors.blocked) return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })
  return new NextResponse(null, { status: 204, headers: cors.headers })
}

export async function POST(req: NextRequest) {
  const cors = makeCors(req, METHODS)
  if (cors.blocked) return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: cors.headers })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', issues: parsed.error.issues },
      { status: 400, headers: cors.headers },
    )
  }

  const { email, password } = parsed.data
  const ip = getClientIpFromNextReq(req)

  const { limited, retryAfterSeconds } = await isRateLimited(email, ip)
  if (limited) {
    return NextResponse.json(
      { error: 'Too many failed attempts. Try again later.', retryAfterSeconds },
      { status: 429, headers: { ...cors.headers, 'Retry-After': String(retryAfterSeconds) } },
    )
  }

  const sql = getDb()
  const users = await sql<{ password_hash: string; role: string; name: string | null }[]>`
    SELECT password_hash, role, name FROM admin_users WHERE email = ${email} LIMIT 1
  `

  const storedHash = users[0]?.password_hash ?? DUMMY_HASH
  const valid = await verifyPassword(password, storedHash)

  if (!valid || !users.length) {
    await recordFailedAttempt(email, ip, password)
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401, headers: cors.headers },
    )
  }

  const { role, name } = users[0]
  const ua    = req.headers.get('user-agent') ?? ''
  const token = await createSession(email, role, name, ip, ua)
  await recordSuccessfulLogin(email, ip)

  return NextResponse.json(
    { ok: true, email, role, name },
    { status: 200, headers: { ...cors.headers, 'Set-Cookie': authCookieValue(token) } },
  )
}
