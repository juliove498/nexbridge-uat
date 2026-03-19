import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { makeCors, getTokenFromNextReq } from '@/lib/admin-api'
import { validateSession } from '@/api/lib/sessions'
import sharp from 'sharp'

const METHODS = ['POST', 'OPTIONS']
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export async function OPTIONS(req: NextRequest) {
  const cors = makeCors(req, METHODS)
  if (cors.blocked) return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })
  return new NextResponse(null, { status: 204, headers: cors.headers })
}

export async function POST(req: NextRequest) {
  const cors = makeCors(req, METHODS)
  if (cors.blocked) return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })

  // Auth check
  const token = getTokenFromNextReq(req)
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors.headers })
  }
  const ua = req.headers.get('user-agent') ?? ''
  const session = await validateSession(token, ua)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors.headers })
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  if (!blobToken) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 500, headers: cors.headers })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400, headers: cors.headers })
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400, headers: cors.headers },
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400, headers: cors.headers },
      )
    }

    // Convert to optimized WebP (max 1920px wide, quality 80)
    const buffer = Buffer.from(await file.arrayBuffer())
    const webpBuffer = await sharp(buffer)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer()

    // Upload to Vercel Blob under insights/ prefix
    const filename = `insights/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`

    const blob = await put(filename, webpBuffer, {
      access: 'public',
      token: blobToken,
      contentType: 'image/webp',
    })

    return NextResponse.json(
      {
        url: blob.url,
        pathname: blob.pathname,
        proxyPath: `/api/media/${blob.pathname}`,
      },
      { status: 200, headers: cors.headers },
    )
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500, headers: cors.headers })
  }
}
