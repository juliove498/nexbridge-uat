import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, await params)
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, await params)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, await params)
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, await params)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, await params)
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': request.headers.get('origin') || '*',
      'access-control-allow-credentials': 'true',
      'access-control-allow-methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
      'access-control-allow-headers': 'Authorization,Content-Type',
    },
  })
}

async function proxy(request: NextRequest, { path }: { path: string[] }) {
  const apiPath = path.join('/')
  const targetUrl = `https://apitest.nexbridge.io/v1/otc/${apiPath}`

  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    if (key === 'host' || key === 'connection') return
    headers[key] = value
  })
  headers['origin'] = 'https://nexbridge.io'

  try {
    const body = request.method !== 'GET' && request.method !== 'HEAD'
      ? await request.text()
      : undefined

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    })

    const responseHeaders = new Headers()
    response.headers.forEach((value, key) => {
      if (key === 'transfer-encoding') return
      responseHeaders.set(key, value)
    })
    responseHeaders.set('access-control-allow-origin', request.headers.get('origin') || '*')
    responseHeaders.set('access-control-allow-credentials', 'true')

    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const data = await response.json()
      return NextResponse.json(data, { status: response.status, headers: responseHeaders })
    }

    const buffer = await response.arrayBuffer()
    return new NextResponse(buffer, { status: response.status, headers: responseHeaders })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: 'Proxy error', message }, { status: 502 })
  }
}
