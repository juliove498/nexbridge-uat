import { NextRequest, NextResponse } from 'next/server'
import { makeCors, getTokenFromNextReq } from '@/lib/admin-api'
import { validateSession } from '@/api/lib/sessions'
import { getArticleById, updateArticle, deleteArticle } from '@/lib/articles'

const METHODS = ['GET', 'PUT', 'DELETE', 'OPTIONS']
const VALID_BADGE_TYPES = ['update', 'info', 'pressRelease']
const VALID_LOCALES = ['en', 'es', 'it', 'pt', 'fr']

async function requireAuth(req: NextRequest) {
  const token = getTokenFromNextReq(req)
  if (!token) return null
  const ua = req.headers.get('user-agent') ?? ''
  return validateSession(token, ua)
}

export async function OPTIONS(req: NextRequest) {
  const cors = makeCors(req, METHODS)
  if (cors.blocked) return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })
  return new NextResponse(null, { status: 204, headers: cors.headers })
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const cors = makeCors(req, METHODS)
  if (cors.blocked) return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })
  if (!await requireAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors.headers })
  }

  const { id } = await params
  const article = await getArticleById(id)
  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404, headers: cors.headers })
  }
  return NextResponse.json(article, { status: 200, headers: cors.headers })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const cors = makeCors(req, METHODS)
  if (cors.blocked) return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })
  if (!await requireAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors.headers })
  }

  const { id } = await params
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: cors.headers })
  }

  // Validate optional fields
  if (body.slug !== undefined) {
    const slug = typeof body.slug === 'string' ? body.slug.trim() : ''
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400, headers: cors.headers })
    }
  }
  if (body.badge_type !== undefined && !VALID_BADGE_TYPES.includes(body.badge_type as string)) {
    return NextResponse.json({ error: 'Invalid badge_type' }, { status: 400, headers: cors.headers })
  }

  const updateData: Record<string, unknown> = {}
  if (body.slug !== undefined) updateData.slug = (body.slug as string).trim()
  if (body.badge_type !== undefined) updateData.badge_type = body.badge_type
  if (body.hero_image_url !== undefined) updateData.hero_image_url = body.hero_image_url
  if (body.hero_image_alt !== undefined) updateData.hero_image_alt = body.hero_image_alt
  if (body.display_order !== undefined) updateData.display_order = body.display_order

  if (Array.isArray(body.translations)) {
    updateData.translations = (body.translations as Record<string, unknown>[])
      .filter(t => VALID_LOCALES.includes(t.locale as string))
      .map(t => ({
        locale: t.locale as string,
        title: (t.title as string) || '',
        excerpt: (t.excerpt as string) || '',
        badge_label: (t.badge_label as string) || '',
        date_label: (t.date_label as string) || '',
        body_html: (t.body_html as string) || '',
      }))
  }

  try {
    const article = await updateArticle(id, updateData)
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404, headers: cors.headers })
    }
    return NextResponse.json(article, { status: 200, headers: cors.headers })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : ''
    if (message.includes('unique') || message.includes('duplicate')) {
      return NextResponse.json({ error: 'Slug already in use' }, { status: 409, headers: cors.headers })
    }
    console.error('Update article error:', err)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500, headers: cors.headers })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const cors = makeCors(req, METHODS)
  if (cors.blocked) return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })
  if (!await requireAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors.headers })
  }

  const { id } = await params
  const deleted = await deleteArticle(id)
  if (!deleted) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404, headers: cors.headers })
  }
  return NextResponse.json({ ok: true }, { status: 200, headers: cors.headers })
}
