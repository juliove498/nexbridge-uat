import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";

const ampIdSchema = z.string().min(10);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { ampId } = req.body;
    const parsed = ampIdSchema.safeParse(ampId);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: "Invalid AmpId format" });
    }

    return res.json({
      success: true,
      data: {
        ampId: parsed.data,
        valid: true,
        balances: [
          { assetId: "asset_napl_001", ticker: "nAAPL", name: "Nexbridge Apple Inc.", amount: 15000, precision: 2, displayAmount: "150.00" },
          { assetId: "asset_nmsft_001", ticker: "nMSFT", name: "Nexbridge Microsoft Corp.", amount: 8500, precision: 2, displayAmount: "85.00" },
          { assetId: "asset_ustbl_001", ticker: "USTBL", name: "Nexbridge US Treasury Bills", amount: 500000000, precision: 8, displayAmount: "5.00" },
        ],
      },
      timestamp: new Date().toISOString(),
    });
  } catch {
    return res.status(400).json({ success: false, error: "Invalid request" });
  }
}
