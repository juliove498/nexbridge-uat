import { NextRequest, NextResponse } from 'next/server'

const UPSTREAM_BASE = 'https://api.nexbridge.finance/api/v1'

async function proxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const apiPath = path.join('/')
  const search = request.nextUrl.search
  const upstreamUrl = `${UPSTREAM_BASE}/${apiPath}${search}`

  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    // Skip headers that interfere with proxying or cause compressed responses
    // that Node fetch won't auto-decompress when accept-encoding is forwarded
    if (key === 'host' || key === 'connection' || key === 'accept-encoding') return
    headers[key] = value
  })

  try {
    const body =
      request.method !== 'GET' && request.method !== 'HEAD'
        ? await request.text()
        : undefined

    const upstream = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body,
    })

    const responseBody = await upstream.text()

    return new NextResponse(responseBody, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') ?? 'application/json',
        'cache-control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Upstream fetch failed' }, { status: 502 })
  }
}

export async function GET(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(request, ctx)
}

export async function POST(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(request, ctx)
}
