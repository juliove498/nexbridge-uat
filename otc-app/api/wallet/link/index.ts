import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { getSession, linkLwkAddress } from "../../_lib/sessions";
import { rateLimit } from "../../_lib/rate-limit";

const linkSchema = z.object({
  sessionToken: z.string().min(1),
  lwkAddress: z.string().min(10),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(`link:${ip}`, { maxRequests: 20, windowMs: 60_000 });
  if (!rl.allowed) {
    return res.status(429).json({ success: false, error: "Too many requests" });
  }

  try {
    const parsed = linkSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: "Invalid request" });
    }

    const { sessionToken, lwkAddress } = parsed.data;
    const session = getSession(sessionToken);
    if (!session) {
      return res.status(401).json({ success: false, error: "Invalid or expired session" });
    }

    const result = linkLwkAddress(sessionToken, lwkAddress);
    if (!result.success) {
      return res.status(401).json({ success: false, error: "Invalid or expired session" });
    }

    return res.json({
      success: true,
      data: { linked: true, ampId: session.ampId, sessionToken: result.newToken },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Wallet link error:", err);
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : "Link failed",
    });
  }
}
