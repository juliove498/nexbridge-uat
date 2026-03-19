import { NextRequest, NextResponse } from 'next/server'
import { makeCors, getTokenFromNextReq } from '@/lib/admin-api'
import { validateSession } from '@/api/lib/sessions'
import { reorderArticles } from '@/lib/articles'

const METHODS = ['PUT', 'OPTIONS']

export async function OPTIONS(req: NextRequest) {
  const cors = makeCors(req, METHODS)
  if (cors.blocked) return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })
  return new NextResponse(null, { status: 204, headers: cors.headers })
}

export async function PUT(req: NextRequest) {
  const cors = makeCors(req, METHODS)
  if (cors.blocked) return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })

  const token = getTokenFromNextReq(req)
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors.headers })
  }
  const ua = req.headers.get('user-agent') ?? ''
  if (!await validateSession(token, ua)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors.headers })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: cors.headers })
  }

  const orderedIds = body.orderedIds
  if (!Array.isArray(orderedIds) || !orderedIds.every(id => typeof id === 'string')) {
    return NextResponse.json({ error: 'orderedIds must be an array of UUID strings' }, { status: 400, headers: cors.headers })
  }

  try {
    await reorderArticles(orderedIds)
    return NextResponse.json({ ok: true }, { status: 200, headers: cors.headers })
  } catch (err) {
    console.error('Reorder error:', err)
    return NextResponse.json({ error: 'Failed to reorder' }, { status: 500, headers: cors.headers })
  }
}
