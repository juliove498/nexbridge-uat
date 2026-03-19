/**
 * GET /api/admin/me
 *
 * Session probe / heartbeat. Refreshes last_seen_at on success (via validateSession).
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { setAdminCors } from '../lib/cors'
import { verifyAuth } from '../lib/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!setAdminCors(req, res, ['GET', 'OPTIONS'])) return
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const session = await verifyAuth(req)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })

  return res.status(200).json({
    email:     session.user_email,
    role:      session.user_role,
    name:      session.user_name,
    sessionId: session.id,
  })
}
