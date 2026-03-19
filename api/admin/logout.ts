/**
 * POST /api/admin/logout
 *
 * Dual invalidation: revokes session in DB + clears the cookie.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { setAdminCors } from '../lib/cors'
import { getTokenFromRequest, clearAuthCookieHeader } from '../lib/auth'
import { revokeSessionByToken } from '../lib/sessions'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!setAdminCors(req, res, ['POST', 'OPTIONS'])) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const token = getTokenFromRequest(req)
  if (token) revokeSessionByToken(token).catch(() => {}) // best-effort, non-blocking

  res.setHeader('Set-Cookie', clearAuthCookieHeader())
  return res.status(200).json({ ok: true })
}
