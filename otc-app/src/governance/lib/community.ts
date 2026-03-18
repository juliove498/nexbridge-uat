// ============================================================================
// NexBridge Community Proposal Utilities
// ============================================================================

import { MOCK_ASSETS } from "@/governance/lib/mock-data";
import type { TokenBalance } from "@/governance/types";

/** Ticker used for NexBridge community/platform proposals */
export const NEXBRIDGE_TICKER = "NEXBRIDGE";

/**
 * Check if a proposal is a NexBridge community proposal
 * (as opposed to a tokenized equity governance proposal).
 */
export function isCommunityProposal(assetTicker: string): boolean {
  return assetTicker === NEXBRIDGE_TICKER;
}

/**
 * Compute community voting power as the total dollar value
 * of all NexTR instrument holdings.
 *
 * For community proposals, voting weight is proportional to the
 * total portfolio value — not a single asset's token count.
 */
export function computeCommunityVotingPower(
  balances: TokenBalance[]
): number {
  return balances.reduce((total, b) => {
    const asset = MOCK_ASSETS.find((a) => a.ticker === b.ticker);
    if (!asset?.navPerToken) return total;
    const displayAmount = b.amount / Math.pow(10, asset.precision);
    return total + displayAmount * asset.navPerToken;
  }, 0);
}

/**
 * Format community voting power as a dollar amount.
 */
export function formatCommunityVotingPower(dollarValue: number): string {
  return `$${dollarValue.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
