import type { VercelRequest, VercelResponse } from "@vercel/node";
import { rateLimit } from "../_lib/rate-limit";

const FAUCET_URL = "https://liquidtestnet.com/api/faucet";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(`faucet:${ip}`, { maxRequests: 5, windowMs: 60_000 });
  if (!rl.allowed) {
    return res.status(429).json({ success: false, error: "Too many requests" });
  }

  try {
    const { address } = req.body;
    if (!address || typeof address !== "string") {
      return res.status(400).json({ error: "Address is required" });
    }

    const faucetUrl = `${FAUCET_URL}?address=${encodeURIComponent(address)}&action=lbtc`;
    const response = await fetch(faucetUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(502).json({ error: `Faucet returned ${response.status}: ${text}` });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error("Faucet proxy error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Faucet request failed",
    });
  }
}
