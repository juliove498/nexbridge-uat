/**
 * Restrictive CORS configuration for admin endpoints.
 *
 * - Production: only origins listed in ADMIN_ALLOWED_ORIGIN (comma-separated) are accepted.
 * - Development: when ADMIN_ALLOWED_ORIGIN is not set, the request's Origin is reflected.
 * - Never uses Access-Control-Allow-Origin: * (incompatible with credentials).
 * - Always sets Vary: Origin and Access-Control-Allow-Credentials: true.
 *
 * Returns true if the request should proceed, false if it was already handled
 * (OPTIONS pre-flight or rejected origin).
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

export function setAdminCors(
  req: VercelRequest,
  res: VercelResponse,
  methods: string[]
): boolean {
  const origin = req.headers.origin ?? ''
  const allowedRaw = process.env.ADMIN_ALLOWED_ORIGIN

  let allowedOrigin: string

  if (allowedRaw) {
    const allowedList = allowedRaw.split(',').map(s => s.trim()).filter(Boolean)
    if (!allowedList.includes(origin)) {
      res.status(403).json({ error: 'Origin not allowed' })
      return false
    }
    allowedOrigin = origin
  } else {
    // Dev fallback: reflect the origin (never '*')
    allowedOrigin = origin || 'null'
  }

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', methods.join(', '))
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Vary', 'Origin')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return false
  }

  return true
}
