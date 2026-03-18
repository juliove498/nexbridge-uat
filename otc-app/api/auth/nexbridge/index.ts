import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  authenticateWithNexBridge,
  getAuthorizeUrl,
  isAuthLive,
} from "../../_lib/nexbridge-auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    try {
      if (isAuthLive()) {
        return res.status(400).json({
          success: false,
          error: "Use GET to initiate OAuth2 redirect in live mode",
        });
      }
      const user = await authenticateWithNexBridge();
      return res.json({
        success: true,
        data: { user },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err instanceof Error ? err.message : "Authentication failed",
      });
    }
  }

  if (req.method === "GET") {
    if (!isAuthLive()) {
      return res.status(400).json({
        success: false,
        error: "Use POST for mock authentication",
      });
    }
    const state = crypto.randomUUID();
    const authorizeUrl = getAuthorizeUrl(state);
    if (!authorizeUrl) {
      return res.status(500).json({
        success: false,
        error: "Failed to build authorize URL",
      });
    }
    return res.redirect(authorizeUrl);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
