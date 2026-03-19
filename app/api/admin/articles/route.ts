import { NextRequest, NextResponse } from 'next/server'
import { makeCors, getTokenFromNextReq } from '@/lib/admin-api'
import { validateSession } from '@/api/lib/sessions'
import { getArticles, createArticle } from '@/lib/articles'

const METHODS = ['GET', 'POST', 'OPTIONS']
const VALID_BADGE_TYPES = ['update', 'info', 'pressRelease']
const VALID_LOCALES = ['en', 'es', 'it', 'pt', 'fr']

async function requireAuth(req: NextRequest, cors: ReturnType<typeof makeCors>) {
  const token = getTokenFromNextReq(req)
  if (!token) return null
  const ua = req.headers.get('user-agent') ?? ''
  const session = await validateSession(token, ua)
  if (!session) return null
  return session
}

export async function OPTIONS(req: NextRequest) {
  const cors = makeCors(req, METHODS)
  if (cors.blocked) return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })
  return new NextResponse(null, { status: 204, headers: cors.headers })
}

export async function GET(req: NextRequest) {
  const cors = makeCors(req, METHODS)
  if (cors.blocked) return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })

  if (!await requireAuth(req, cors)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors.headers })
  }

  const articles = await getArticles()
  return NextResponse.json(articles, { status: 200, headers: cors.headers })
}

export async function POST(req: NextRequest) {
  const cors = makeCors(req, METHODS)
  if (cors.blocked) return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })

  if (!await requireAuth(req, cors)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors.headers })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: cors.headers })
  }

  // Validate
  const slug = typeof body.slug === 'string' ? body.slug.trim() : ''
  const badge_type = typeof body.badge_type === 'string' ? body.badge_type : ''
  const hero_image_url = typeof body.hero_image_url === 'string' ? body.hero_image_url : ''
  const hero_image_alt = typeof body.hero_image_alt === 'string' ? body.hero_image_alt : ''
  const display_order = typeof body.display_order === 'number' ? body.display_order : 0

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug. Use lowercase letters, numbers, and hyphens only.' }, { status: 400, headers: cors.headers })
  }
  if (!VALID_BADGE_TYPES.includes(badge_type)) {
    return NextResponse.json({ error: `Invalid badge_type. Must be one of: ${VALID_BADGE_TYPES.join(', ')}` }, { status: 400, headers: cors.headers })
  }
  if (!hero_image_url) {
    return NextResponse.json({ error: 'hero_image_url is required' }, { status: 400, headers: cors.headers })
  }

  // Validate translations
  const translations = Array.isArray(body.translations) ? body.translations : []
  const enTranslation = translations.find((t: Record<string, unknown>) => t.locale === 'en')
  if (!enTranslation || !enTranslation.title) {
    return NextResponse.json({ error: 'English translation with title is required' }, { status: 400, headers: cors.headers })
  }

  const validTranslations = translations
    .filter((t: Record<string, unknown>) => VALID_LOCALES.includes(t.locale as string))
    .map((t: Record<string, unknown>) => ({
      locale: t.locale as string,
      title: (t.title as string) || '',
      excerpt: (t.excerpt as string) || '',
      badge_label: (t.badge_label as string) || '',
      date_label: (t.date_label as string) || '',
      body_html: (t.body_html as string) || '',
    }))

  try {
    const article = await createArticle({
      slug,
      badge_type,
      hero_image_url,
      hero_image_alt,
      display_order,
      translations: validTranslations,
    })
    return NextResponse.json(article, { status: 201, headers: cors.headers })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    if (message.includes('unique') || message.includes('duplicate')) {
      return NextResponse.json({ error: 'An article with this slug already exists' }, { status: 409, headers: cors.headers })
    }
    console.error('Create article error:', err)
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500, headers: cors.headers })
  }
}
