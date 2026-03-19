import { NextRequest, NextResponse } from 'next/server'
import { makeCors, getTokenFromNextReq } from '@/lib/admin-api'
import { validateSession } from '@/api/lib/sessions'

const METHODS = ['GET', 'OPTIONS']

export async function OPTIONS(req: NextRequest) {
  const cors = makeCors(req, METHODS)
  if (cors.blocked) return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })
  return new NextResponse(null, { status: 204, headers: cors.headers })
}

export async function GET(req: NextRequest) {
  const cors = makeCors(req, METHODS)
  if (cors.blocked) return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })

  const token = getTokenFromNextReq(req)
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors.headers })
  }

  const ua      = req.headers.get('user-agent') ?? ''
  const session = await validateSession(token, ua)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors.headers })
  }

  return NextResponse.json(
    { email: session.user_email, role: session.user_role, name: session.user_name, sessionId: session.id },
    { status: 200, headers: cors.headers },
  )
}
