/**
 * Restrictive CORS for admin endpoints.
 * Production: only ADMIN_ALLOWED_ORIGIN origins accepted (comma-separated env var).
 * Dev: reflects the request Origin (never '*').
 * Always sets credentials:true and Vary:Origin.
 * Returns false if the request was already handled (rejected origin or OPTIONS preflight).
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

export function setAdminCors(req: VercelRequest, res: VercelResponse, methods: string[]): boolean {
  const origin     = req.headers.origin ?? ''
  const allowedRaw = process.env.ADMIN_ALLOWED_ORIGIN

  let allowedOrigin: string
  if (allowedRaw) {
    const list = allowedRaw.split(',').map(s => s.trim()).filter(Boolean)
    if (!list.includes(origin)) {
      res.status(403).json({ error: 'Origin not allowed' })
      return false
    }
    allowedOrigin = origin
  } else {
    allowedOrigin = origin || 'null' // dev fallback — never '*'
  }

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', methods.join(', '))
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Vary', 'Origin')

  if (req.method === 'OPTIONS') { res.status(204).end(); return false }
  return true
}
