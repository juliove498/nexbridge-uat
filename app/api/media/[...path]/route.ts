import { NextRequest, NextResponse } from 'next/server'
import { head } from '@vercel/blob'

const ALLOWED_PREFIXES = ['insights/']
const CACHE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  const joined = path.join('/')

  // Only allow known prefixes
  if (!ALLOWED_PREFIXES.some(p => joined.startsWith(p))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 500 })
  }

  try {
    // Look up the blob by pathname
    const blobUrl = `https://${process.env.BLOB_STORE_ID ?? ''}.public.blob.vercel-storage.com/${joined}`
    const meta = await head(blobUrl, { token })

    // Fetch the actual blob content
    const response = await fetch(meta.url)
    if (!response.ok) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const body = response.body
    const contentType = meta.contentType || response.headers.get('content-type') || 'application/octet-stream'

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, immutable`,
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
