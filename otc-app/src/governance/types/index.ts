// ============================================================================
// NexTR - On-Chain Hodler-Instruction Governance for NexTR Instruments
// Core Type Definitions
// ============================================================================

/** Liquid Network asset identifier (hex string) */
export type AssetId = string;

/** Blockstream App Account ID */
export type AmpId = string;

/** Liquid Network confidential address */
export type LiquidAddress = string;

/** PSET (Partially Signed Elements Transaction) hex */
export type PSETHex = string;

/** Transaction ID on Liquid Network */
export type TxId = string;

// ---------------------------------------------------------------------------
// Wallet & Authentication
// ---------------------------------------------------------------------------

export interface WalletConnection {
  ampId: AmpId;
  address: LiquidAddress;
  connected: boolean;
  method: "ampId" | "lwk-only";
  pubkey: string;
  /** Server-issued session token linking AmpId ↔ LWK address */
  sessionToken?: string;
  /** Whether the AmpId was verified against AMP */
  ampIdVerified?: boolean;
  /** LWK signing wallet address (separate from AmpId identity) */
  lwkAddress?: string;
}

/** Connection progress steps for the UI stepper */
export type ConnectionStep =
  | "idle"
  | "authenticating" // NexBridge OAuth2 sign-in
  | "validating"     // Verifying AmpId with AMP
  | "provisioning"   // Creating/restoring LWK signing wallet
  | "syncing"        // Syncing LWK with Liquid Network
  | "linking"        // Linking AmpId ↔ LWK on server
  | "ready"          // All done
  | "error";

/** Server-side session linking AmpId identity to LWK signing wallet */
export interface WalletSession {
  token: string;
  ampId: AmpId;
  lwkAddress: LiquidAddress | null;
  balances: TokenBalance[];
  verified: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface TokenBalance {
  assetId: AssetId;
  ticker: string;
  name: string;
  amount: number;
  precision: number;
  displayAmount: string;
}

export interface VoterProfile {
  ampId: AmpId;
  registeredAt: string;
  kycVerified: boolean;
  balances: TokenBalance[];
  votingPower: Record<AssetId, number>;
}

// ---------------------------------------------------------------------------
// Nexbridge Equity Assets
// ---------------------------------------------------------------------------

export interface NexbridgeAsset {
  id: string;
  assetId: AssetId;
  ticker: string;
  name: string;
  description: string;
  category: "equity" | "index" | "treasury" | "allocation" | "platform";
  precision: number;
  totalSupply: number;
  iconUrl?: string;
  navPerToken?: number;
  lastUpdated: string;
}

// ---------------------------------------------------------------------------
// Instruction Event Classification (per CEO governance memo 2026-02-15)
// ---------------------------------------------------------------------------

/**
 * Portal taxonomy — maps to the three execution pathways described in the
 * corporate-action workflow:
 *
 * instruction_vote  – Omnibus execution (e.g. proxy votes).
 *                     Depositary SPV submits a single instruction via broker/custodian.
 * election          – Token-level allocation (e.g. cash vs reinvest).
 *                     Per-holder elections reflected at the token layer.
 * non_elective      – Registry update only (e.g. splits, mergers, symbol changes).
 *                     No holder instruction required.
 */
export type InstructionEventType =
  | "instruction_vote"
  | "election"
  | "non_elective";

/**
 * Roles in the corporate action chain (for diagram / site labels).
 */
export type CorporateActionRole =
  | "depositary_spv"
  | "broker_custodian"
  | "trust_trustee"
  | "program_sponsor"
  | "registry_operator"
  | "settlement_verifier";

// ---------------------------------------------------------------------------
// Proposals & Governance Instructions
// ---------------------------------------------------------------------------

export type ProposalStatus =
  | "draft"
  | "active"
  | "closed"
  | "executed"
  | "cancelled";

export type VoteChoice = "for" | "against" | "abstain";

/**
 * Proposal categories mirroring real institutional proxy voting.
 * Based on ISS/Glass Lewis governance frameworks.
 */
export type ProposalCategory =
  | "board_election"           // Election of directors
  | "say_on_pay"               // Advisory vote on executive compensation
  | "auditor_ratification"     // Ratify appointment of external auditor
  | "merger_acquisition"       // Approve M&A transactions
  | "dividend_distribution"    // Approve dividend payout or policy
  | "stock_action"             // Stock splits, reverse splits, authorized shares
  | "bylaw_amendment"          // Changes to corporate bylaws/charter
  | "capital_action"           // Issuance of new shares, buyback programs
  | "shareholder_proposal"     // Shareholder-initiated proposal
  | "shareholder_esg"          // ESG / Sustainability proposals
  | "shareholder_exec_comp"    // Executive compensation limits
  | "shareholder_governance"   // Governance reform (proxy access, chair, etc.)
  | "shareholder_transparency" // Transparency / disclosure requests
  | "shareholder_rights"       // Shareholder rights proposals
  | "governance"               // General governance changes (quorum, thresholds)
  | "other"                    // Any other corporate action
  // ── Community categories (NexBridge platform proposals) ──
  | "community_new_underlying"   // Request tokenization of a new underlying asset
  | "community_listing_venue"    // Request listing on a new exchange/venue
  | "community_bespoke_product"  // Request a custom/tailored instrument
  | "community_program_features" // Request portal features, APIs, UX improvements
  | "community_market_structure" // Request market structure changes
  | "community_transparency"     // Documentation & transparency requests
  | "community_other";           // Other community proposal

/**
 * Resolution type determines the approval threshold.
 * Mirrors traditional corporate governance frameworks.
 */
export type ResolutionType =
  | "ordinary"       // Simple majority of votes cast (>50%)
  | "special"        // Supermajority required (≥66.7% or ≥75%)
  | "advisory";      // Non-binding advisory vote (say-on-pay, auditor ratification)

/**
 * Who initiated the proposal.
 */
export type ProposerType =
  | "management"     // Board / issuer initiated
  | "shareholder"    // Shareholder initiated
  | "community";     // NexBridge community initiated

export interface ProposalOption {
  id: string;
  label: string;
  description?: string;
}

/**
 * Shareholder proposal submission thresholds.
 * Adapted from SEC Rule 14a-8 for the Nexbridge on-chain context.
 *
 * On NexTR, ANY token holder (even 1 token) can submit a shareholder
 * proposal. This is a deliberate design choice: on-chain governance
 * removes the administrative costs that justified SEC's $2,000+ thresholds.
 * However, the resubmission thresholds still apply to prevent spam.
 */
export interface ProposalThresholds {
  /** Minimum tokens to submit a proposal (1 = any holder) */
  minTokensToPropose: number;
  /** Minimum holding period in blocks before proposing */
  minHoldingPeriodBlocks: number;
  /** Quorum: ordinary resolution */
  ordinaryQuorum: number;
  /** Quorum: special resolution */
  specialQuorum: number;
  /** Approval: ordinary resolution (% of votes cast) */
  ordinaryApproval: number;
  /** Approval: special resolution (% of votes cast) */
  specialApproval: number;
  /** Resubmission threshold: 1st attempt (%) */
  resubmitThreshold1: number;
  /** Resubmission threshold: 2nd attempt (%) */
  resubmitThreshold2: number;
  /** Resubmission threshold: 3rd+ attempt (%) */
  resubmitThreshold3: number;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  summary: string;
  category: ProposalCategory;
  resolutionType: ResolutionType;
  proposerType: ProposerType;
  /** Instruction event classification per corporate-action workflow */
  instructionEventType: InstructionEventType;
  assetId: AssetId;
  assetTicker: string;
  assetName: string;
  proposer: AmpId;
  status: ProposalStatus;
  options: ProposalOption[];
  quorumRequired: number; // percentage of total supply
  approvalThreshold: number; // percentage of votes cast to pass
  startBlock: number;
  endBlock: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  snapshotBlock: number;
  totalVotingPower: number;
  recordDate: string; // equivalent of "record date" in traditional finance
  meetingType: "annual" | "special" | "written_consent";
  boardRecommendation?: VoteChoice; // board's recommendation (management proposals)
  metadata?: Record<string, string>;
}

export interface Vote {
  id: string;
  proposalId: string;
  voter: AmpId;
  optionId: string;
  votingPower: number;
  txId: TxId;
  pset?: PSETHex;
  blockHeight: number;
  timestamp: string;
  signature: string;
}

export interface VoteTally {
  proposalId: string;
  options: {
    optionId: string;
    label: string;
    votes: number;
    votingPower: number;
    percentage: number;
  }[];
  totalVotes: number;
  totalVotingPower: number;
  quorumReached: boolean;
  quorumPercentage: number;
  participationRate: number;
}

// ---------------------------------------------------------------------------
// Liquid Network Transaction Types
// ---------------------------------------------------------------------------

export interface LiquidTransaction {
  txId: TxId;
  blockHeight: number;
  timestamp: string;
  confirmations: number;
  fee: number;
  inputs: LiquidTxIO[];
  outputs: LiquidTxIO[];
}

export interface LiquidTxIO {
  address: LiquidAddress;
  assetId: AssetId;
  amount: number;
  blinded: boolean;
}

export interface VoteTransaction {
  proposalId: string;
  optionId: string;
  amount: number; // voting power (token amount)
  voterAddress: LiquidAddress;
  voteAddress: LiquidAddress; // address representing the vote choice
  memo: string;
  pset: PSETHex;
}

// ---------------------------------------------------------------------------
// API Response Types
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

// ---------------------------------------------------------------------------
// AMP (Asset Management Platform) Types
// ---------------------------------------------------------------------------

export interface AMPAsset {
  uuid: string;
  assetId: AssetId;
  name: string;
  ticker: string;
  precision: number;
  isConfidential: boolean;
  isReissuable: boolean;
  domain: string;
}

export interface AMPRegisteredUser {
  id: string;
  ampId: AmpId;
  categories: string[];
  isEligible: boolean;
}

export interface AMPOwnership {
  ampId: AmpId;
  balance: number;
  percentage: number;
}

// ---------------------------------------------------------------------------
// NexBridge Authentication (OAuth2 via AWS Cognito)
// ---------------------------------------------------------------------------

/** A single portfolio (AmpId) returned from NexBridge after authentication */
export interface NexBridgePortfolio {
  ampId: AmpId;
  label: string;
  balances: TokenBalance[];
  verified: boolean;
}

/** User profile returned from NexBridge OAuth2 flow */
export interface NexBridgeUser {
  /** NexBridge user ID (sub claim from the Cognito ID token) */
  nexbridgeId: string;
  /** Display name from NexBridge profile */
  displayName: string;
  /** Email (may be masked) */
  email: string;
  /** All portfolios (AMP IDs) associated with this NexBridge account */
  portfolios: NexBridgePortfolio[];
}
