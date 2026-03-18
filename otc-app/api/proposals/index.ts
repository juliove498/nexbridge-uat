import type { VercelRequest, VercelResponse } from "@vercel/node";
import { MOCK_PROPOSALS, MOCK_TALLIES } from "../../src/governance/lib/mock-data";
import type { Proposal, VoteTally } from "../_lib/types";

function getProposalsAndTallies(): {
  proposals: Proposal[];
  tallies: Record<string, VoteTally>;
  source: "mock";
} {
  return { proposals: MOCK_PROPOSALS, tallies: MOCK_TALLIES, source: "mock" };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 20));
    const status = req.query.status as string | undefined;
    const asset = req.query.asset as string | undefined;

    const { proposals, tallies, source } = getProposalsAndTallies();
    let filtered = [...proposals];

    if (status) filtered = filtered.filter((p) => p.status === status);
    if (asset) filtered = filtered.filter((p) => p.assetTicker === asset);

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginated = filtered.slice(start, end);

    return res.json({
      success: true,
      data: paginated.map((p) => ({ ...p, tally: tallies[p.id] ?? null })),
      page, pageSize, total: filtered.length,
      hasMore: end < filtered.length,
      source,
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method === "POST") {
    try {
      const body = req.body;
      return res.status(201).json({
        success: true,
        data: {
          id: `prop-${Date.now()}`,
          ...body,
          status: "draft",
          createdAt: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
    } catch {
      return res.status(400).json({ success: false, error: "Invalid request body" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
