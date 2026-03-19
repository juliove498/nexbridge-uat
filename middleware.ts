import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

function isAdminRoute(pathname: string) {
  return pathname.startsWith('/admin') || pathname.startsWith('/api/admin')
}

function checkBasicAuth(request: NextRequest): NextResponse | null {
  const authHeader = request.headers.get('authorization')
  const AUTH_USER = process.env.BASIC_AUTH_USER
  const AUTH_PASS = process.env.BASIC_AUTH_PASS

  if (!AUTH_USER || !AUTH_PASS) return null

  if (authHeader) {
    const authValue = authHeader.split(' ')[1] ?? ''
    const [user, pwd] = atob(authValue).split(':')
    if (user === AUTH_USER && pwd === AUTH_PASS) {
      return null
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
  })
}

export default function middleware(request: NextRequest) {
  if (isAdminRoute(request.nextUrl.pathname)) {
    const authResponse = checkBasicAuth(request)
    if (authResponse) return authResponse
    return NextResponse.next()
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!otc-uat|_next|.*\\..*).*)',
  ],
}
