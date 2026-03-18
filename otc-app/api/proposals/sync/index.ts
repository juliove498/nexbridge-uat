import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // In mock mode, EDGAR sync is a no-op
  return res.json({
    success: true,
    data: {
      mode: "mock",
      message: "EDGAR sync skipped (mock mode). Mock proposals served from mock-data.ts.",
      cache: {
        cached: false,
        syncedAt: null,
        expiresAt: null,
        proposalCount: 0,
        filingsChecked: 0,
        errors: [],
      },
    },
    timestamp: new Date().toISOString(),
  });
}
