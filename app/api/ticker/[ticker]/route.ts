import { NextRequest, NextResponse } from 'next/server'

const UPSTREAM_BASE = 'https://api.nexbridge.io/v1/ticker'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> },
) {
  const { ticker } = await params

  // Only allow safe ticker symbols (alphanumeric, hyphens, underscores, dots)
  if (!/^[A-Za-z0-9._-]{1,20}$/.test(ticker)) {
    return NextResponse.json({ error: 'Invalid ticker' }, { status: 400 })
  }

  const upstreamUrl = `${UPSTREAM_BASE}/${encodeURIComponent(ticker)}`

  try {
    const upstream = await fetch(upstreamUrl, {
      next: { revalidate: 30 }, // cache for 30 s on the edge
    })

    const body = await upstream.text()

    return new NextResponse(body, {
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
