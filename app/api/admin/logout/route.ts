import { NextRequest, NextResponse } from 'next/server'
import { makeCors, getTokenFromNextReq, clearCookieValue } from '../_lib'
import { revokeSessionByToken } from '@/api/lib/sessions'

const METHODS = ['POST', 'OPTIONS']

export async function OPTIONS(req: NextRequest) {
  const cors = makeCors(req, METHODS)
  if (cors.blocked) return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })
  return new NextResponse(null, { status: 204, headers: cors.headers })
}

export async function POST(req: NextRequest) {
  const cors = makeCors(req, METHODS)
  if (cors.blocked) return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })

  const token = getTokenFromNextReq(req)
  if (token) revokeSessionByToken(token).catch(() => {}) // best-effort, non-blocking

  return NextResponse.json(
    { ok: true },
    { status: 200, headers: { ...cors.headers, 'Set-Cookie': clearCookieValue() } },
  )
}
