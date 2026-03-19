/**
 * Shared utilities for Next.js Route Handlers (app/api/admin/*).
 * The root api/lib/* files use VercelRequest/VercelResponse types —
 * these wrappers use standard NextRequest / Web API types instead.
 */

import { NextRequest } from 'next/server'

const COOKIE_NAME = 'admin_token'
const COOKIE_MAX_AGE = 7200 // 2 h

const isSecure = process.env.NODE_ENV === 'production'

// ── CORS ────────────────────────────────────────────────────────────────────

export function makeCors(
  req: NextRequest,
  methods: string[],
): { headers: Record<string, string>; blocked: boolean } {
  const origin      = req.headers.get('origin') ?? ''
  const allowedRaw  = process.env.ADMIN_ALLOWED_ORIGIN

  let allowedOrigin: string
  if (allowedRaw) {
    const list = allowedRaw.split(',').map(s => s.trim()).filter(Boolean)
    if (!list.includes(origin)) return { headers: {}, blocked: true }
    allowedOrigin = origin
  } else {
    allowedOrigin = origin || 'null' // dev fallback — never '*'
  }

  return {
    blocked: false,
    headers: {
      'Access-Control-Allow-Origin':      allowedOrigin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods':     methods.join(', '),
      'Access-Control-Allow-Headers':     'Content-Type',
      'Vary':                             'Origin',
    },
  }
}

// ── Cookie helpers ───────────────────────────────────────────────────────────

export function getTokenFromNextReq(req: NextRequest): string | null {
  return req.cookies.get(COOKIE_NAME)?.value ?? null
}

export function authCookieValue(token: string): string {
  const base = `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${COOKIE_MAX_AGE}`
  return isSecure ? `${base}; Secure` : base
}

export function clearCookieValue(): string {
  const base = `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`
  return isSecure ? `${base}; Secure` : base
}

// ── IP extraction ────────────────────────────────────────────────────────────

export function getClientIpFromNextReq(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    '0.0.0.0'
  )
}
