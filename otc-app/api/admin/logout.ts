/**
 * POST /api/admin/logout
 *
 * Dual invalidation:
 *  1. Revokes the session in DB (revoked_at = NOW()) — server-side invalidation
 *  2. Clears the cookie (Max-Age=0) — client-side invalidation
 *
 * Both steps are performed regardless of the other succeeding.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { setAdminCors } from '../lib/cors'
import { getTokenFromRequest, clearAuthCookieHeader } from '../lib/auth'
import { revokeSessionByToken } from '../lib/sessions'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!setAdminCors(req, res, ['POST', 'OPTIONS'])) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const token = getTokenFromRequest(req)
  if (token) {
    // Best-effort DB revocation — do not block the response on failure
    revokeSessionByToken(token).catch(() => {})
  }

  // Always clear the cookie, even if DB revocation fails
  res.setHeader('Set-Cookie', clearAuthCookieHeader())
  return res.status(200).json({ ok: true })
}
