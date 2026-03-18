import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { createSession } from "../../_lib/sessions";
import { resolveGaidBalances } from "../../_lib/amp";
import { rateLimit } from "../../_lib/rate-limit";

const connectSchema = z.object({
  ampId: z.string().min(10, "AmpId must be at least 10 characters"),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(`connect:${ip}`, { maxRequests: 10, windowMs: 60_000 });
  if (!rl.allowed) {
    return res.status(429).json({ success: false, error: "Too many requests" });
  }

  try {
    const parsed = connectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: "Invalid AmpId format" });
    }

    const { ampId } = parsed.data;
    const { verified, balances } = await resolveGaidBalances(ampId);

    if (!verified) {
      return res.status(403).json({ success: false, error: "AmpId could not be verified" });
    }

    const session = createSession(ampId, balances);

    return res.json({
      success: true,
      data: {
        sessionToken: session.token,
        ampId: session.ampId,
        verified: session.verified,
        balances: session.balances,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Wallet connect error:", err);
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : "Connection failed",
    });
  }
}
