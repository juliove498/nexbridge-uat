import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSession, getVotingPower } from "../_lib/sessions";
import { MOCK_PROPOSALS, MOCK_TALLIES } from "../../src/governance/lib/mock-data";
import { rateLimit } from "../_lib/rate-limit";

const votes = new Map<string, {
  proposalId: string;
  optionId: string;
  ampId: string;
  txId: string;
  votingPower: number;
  voterAddress?: string;
  timestamp: string;
}>();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(`votes:${ip}`, { maxRequests: 10, windowMs: 60_000 });
  if (!rl.allowed) {
    return res.status(429).json({ success: false, error: "Too many requests" });
  }

  if (req.method === "POST") {
    try {
      const {
        proposalId, optionId, voterAmpId, txid,
        sessionToken, voterAddress,
      } = req.body as {
        proposalId?: string; optionId?: string; voterAmpId?: string;
        txid?: string; sessionToken?: string; voterAddress?: string;
      };

      if (!proposalId || !optionId || !voterAmpId || !sessionToken) {
        return res.status(400).json({
          success: false,
          error: "proposalId, optionId, voterAmpId, and sessionToken are required",
        });
      }

      const session = getSession(sessionToken);
      if (!session) {
        return res.status(401).json({ success: false, error: "Invalid or expired session" });
      }

      const proposal = MOCK_PROPOSALS.find((p) => p.id === proposalId);
      if (!proposal) {
        return res.status(404).json({ success: false, error: "Proposal not found" });
      }
      if (proposal.status !== "active") {
        return res.status(400).json({ success: false, error: "Proposal is not active" });
      }

      const option = proposal.options.find((o) => o.id === optionId);
      if (!option) {
        return res.status(400).json({ success: false, error: "Invalid vote option" });
      }

      const voteKey = `${proposalId}:${voterAmpId}`;
      if (votes.has(voteKey)) {
        return res.status(409).json({ success: false, error: "Already voted on this proposal" });
      }

      const votingPower = getVotingPower(session, proposal.assetTicker);

      // TODO: production — verify tx on Liquid Network
      const txId = txid || `tx_${Date.now().toString(16)}_${Math.random().toString(16).slice(2, 10)}`;

      votes.set(voteKey, {
        proposalId, optionId, ampId: voterAmpId,
        txId, votingPower, voterAddress,
        timestamp: new Date().toISOString(),
      });

      return res.json({
        success: true,
        data: { txId, proposalId, optionId, votingPower },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Vote error:", err);
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  if (req.method === "GET") {
    const proposalId = req.query.proposalId as string | undefined;
    if (!proposalId) {
      return res.status(400).json({ success: false, error: "proposalId is required" });
    }

    const tally = MOCK_TALLIES[proposalId];
    if (!tally) {
      return res.status(404).json({ success: false, error: "No tally found" });
    }

    return res.json({
      success: true,
      data: tally,
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
