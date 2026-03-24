import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { makeCors, getTokenFromNextReq } from '@/lib/admin-api'
import { validateSession } from '@/api/lib/sessions'
import { getDb } from '@/api/lib/db'

const METHODS = ['GET', 'PUT', 'OPTIONS']

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

/**
 * GET /api/admin/translations
 *   → returns list of distinct namespaces
 *
 * GET /api/admin/translations?namespace=HomePage
 *   → returns all rows for that namespace, ordered by key_path
 */
export async function GET(req: NextRequest) {
  const cors = makeCors(req, METHODS)
  if (cors.blocked) return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })

  if (!await requireAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors.headers })
  }

  const sql = getDb()
  const namespace = req.nextUrl.searchParams.get('namespace')

  if (!namespace) {
    // Return distinct namespaces with their key count
    const rows = await sql<{ namespace: string; count: string }[]>`
      SELECT namespace, COUNT(*)::text AS count
      FROM page_translations
      GROUP BY namespace
      ORDER BY namespace
    `
    return NextResponse.json(rows, { status: 200, headers: cors.headers })
  }

  const rows = await sql<{
    id: number
    namespace: string
    key_path: string
    en: string
    es: string
    it: string
    pt: string
    fr: string
    updated_at: string
    updated_by: string | null
  }[]>`
    SELECT id, namespace, key_path, en, es, it, pt, fr, updated_at, updated_by
    FROM page_translations
    WHERE namespace = ${namespace}
    ORDER BY key_path
  `
  return NextResponse.json(rows, { status: 200, headers: cors.headers })
}

const putSchema = z.object({
  namespace: z.string().min(1).max(100),
  key_path:  z.string().min(1).max(500),
  locale:    z.enum(['en', 'es', 'it', 'pt', 'fr']),
  value:     z.string().max(10000),
})

/**
 * PUT /api/admin/translations
 * Body: { namespace, key_path, locale, value }
 * Upserts a single locale cell and invalidates the translations cache tag.
 */
export async function PUT(req: NextRequest) {
  const cors = makeCors(req, METHODS)
  if (cors.blocked) return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })

  const session = await requireAuth(req)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors.headers })
  }

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: cors.headers })
  }

  const parsed = putSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', issues: parsed.error.issues },
      { status: 400, headers: cors.headers },
    )
  }

  const { namespace, key_path, locale, value } = parsed.data
  const sql = getDb()

  // Dynamic column name is safe here — locale is validated as a strict enum above
  const row = await sql<{ id: number; updated_at: string }[]>`
    INSERT INTO page_translations (namespace, key_path, ${sql(locale)}, updated_at, updated_by)
    VALUES (${namespace}, ${key_path}, ${value}, NOW(), ${session.user_email})
    ON CONFLICT (namespace, key_path) DO UPDATE SET
      ${sql(locale)} = EXCLUDED.${sql(locale)},
      updated_at     = NOW(),
      updated_by     = ${session.user_email}
    RETURNING id, updated_at
  `

  // Bust the translations cache so next page render picks up the change
  revalidateTag('translations')

  return NextResponse.json(
    { ok: true, id: row[0].id, updated_at: row[0].updated_at },
    { status: 200, headers: cors.headers },
  )
}
