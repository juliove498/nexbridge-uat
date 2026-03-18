// ============================================================================
// NexTR Constants
// ============================================================================

export const LIQUID_NETWORK = {
  MAINNET_ESPLORA: "https://blockstream.info/liquid/api",
  TESTNET_ESPLORA: "https://blockstream.info/liquidtestnet/api",
  MAINNET_ELECTRUM: "wss://blockstream.info/liquid/electrum-websocket/api",
  TESTNET_ELECTRUM: "wss://blockstream.info/liquidtestnet/electrum-websocket/api",
  BLOCK_TIME_SECONDS: 60,
  CONFIRMATIONS_REQUIRED: 2,
} as const;

export const AMP_API = {
  BASE_URL: "https://amp.blockstream.com/api",
  ENDPOINTS: {
    AUTH: "/user/obtain_token",
    ASSETS: "/assets",
    REGISTERED_USERS: "/registered_users",
    AMP_IDS: "/amp-ids",
    DISTRIBUTIONS: "/distributions",
    ASSIGNMENTS: "/assignments",
    CATEGORIES: "/categories",
  },
} as const;

/**
 * Nexbridge equity asset definitions.
 * In production these would come from the AMP API / Liquid Asset Registry.
 */
export const NEXBRIDGE_ASSETS = [
  {
    id: "nAAPL",
    ticker: "nAAPL",
    name: "Nexbridge Apple Inc.",
    category: "equity" as const,
    description: "Tokenized exposure to Apple Inc. (AAPL) on Liquid Network",
    precision: 2,
  },
  {
    id: "nMSFT",
    ticker: "nMSFT",
    name: "Nexbridge Microsoft Corp.",
    category: "equity" as const,
    description: "Tokenized exposure to Microsoft Corp. (MSFT) on Liquid Network",
    precision: 2,
  },
  {
    id: "nTSLA",
    ticker: "nTSLA",
    name: "Nexbridge Tesla Inc.",
    category: "equity" as const,
    description: "Tokenized exposure to Tesla Inc. (TSLA) on Liquid Network",
    precision: 2,
  },
  {
    id: "nSPY",
    ticker: "nSPY",
    name: "Nexbridge S&P 500 Index",
    category: "index" as const,
    description: "Tokenized exposure to S&P 500 via SPY ETF on Liquid Network",
    precision: 2,
  },
  {
    id: "nNSDQ",
    ticker: "nNSDQ",
    name: "Nexbridge Nasdaq 100 Index",
    category: "index" as const,
    description: "Tokenized exposure to Nasdaq 100 on Liquid Network",
    precision: 2,
  },
  {
    id: "USTBL",
    ticker: "USTBL",
    name: "Nexbridge US Treasury Bills",
    category: "treasury" as const,
    description: "Regulated tokenized U.S. Treasury Bill exposure on Liquid Network",
    precision: 8,
  },
  // ── Platform governance ──────────────────────────────────────────────
  {
    id: "NEXBRIDGE",
    ticker: "NEXBRIDGE",
    name: "NexBridge Platform",
    category: "platform" as const,
    description: "Community governance proposals for the NexBridge platform and program",
    precision: 2,
  },
] as const;

export const VOTE_MEMO_PREFIX = "NEXTR_VOTE:";

export const PROPOSAL_DEFAULTS = {
  QUORUM_PERCENTAGE: 10,
  MIN_VOTING_PERIOD_BLOCKS: 4320, // ~3 days at 1 min blocks
  MAX_VOTING_PERIOD_BLOCKS: 43200, // ~30 days
} as const;

/**
 * Shareholder proposal thresholds.
 *
 * Unlike SEC Rule 14a-8 which requires $2,000-$25,000 minimum holdings,
 * NexTR allows ANY token holder (even 1 token) to submit proposals.
 * On-chain governance eliminates the administrative cost burden that
 * justified traditional high thresholds. However, resubmission
 * thresholds (adapted from SEC rules) prevent proposal spam.
 */
export const PROPOSAL_THRESHOLDS = {
  /** Any holder can propose — even 1 token */
  MIN_TOKENS_TO_PROPOSE: 1,
  /** Must hold tokens for at least 1440 blocks (~1 day) before proposing */
  MIN_HOLDING_PERIOD_BLOCKS: 1440,
  /** Ordinary resolution quorum: 10% of total voting power */
  ORDINARY_QUORUM: 10,
  /** Special resolution quorum: 25% of total voting power */
  SPECIAL_QUORUM: 25,
  /** Ordinary resolution approval: >50% of votes cast */
  ORDINARY_APPROVAL: 50,
  /** Special resolution approval: ≥66.7% of votes cast */
  SPECIAL_APPROVAL: 66.7,
  /** Resubmission threshold: <5% on 1st attempt = can't resubmit for 3 years */
  RESUBMIT_THRESHOLD_1: 5,
  /** Resubmission threshold: <15% on 2nd attempt */
  RESUBMIT_THRESHOLD_2: 15,
  /** Resubmission threshold: <25% on 3rd+ attempt */
  RESUBMIT_THRESHOLD_3: 25,
} as const;

/**
 * Proposal categories with human-readable labels and descriptions.
 *
 * `shareholderSubmittable` indicates whether token holders can create
 * proposals of this type. Management-only categories (board elections,
 * M&A, dividends, etc.) can only be created by the issuer / trust.
 */
export const PROPOSAL_CATEGORIES = [
  // ── Management-only categories (not shown on public create page) ──────
  {
    id: "board_election" as const,
    label: "Board of Directors Election",
    description: "Elect or re-elect members of the board of directors",
    resolutionType: "ordinary" as const,
    proposerType: "management" as const,
    instructionEventType: "instruction_vote" as const,
    boardRecAllowed: true,
    shareholderSubmittable: false,
  },
  {
    id: "say_on_pay" as const,
    label: "Say-on-Pay (Executive Compensation)",
    description: "Advisory instruction on executive compensation packages",
    resolutionType: "advisory" as const,
    proposerType: "management" as const,
    instructionEventType: "instruction_vote" as const,
    boardRecAllowed: true,
    shareholderSubmittable: false,
  },
  {
    id: "auditor_ratification" as const,
    label: "Auditor Ratification",
    description: "Ratify appointment of external auditor / accounting firm",
    resolutionType: "advisory" as const,
    proposerType: "management" as const,
    instructionEventType: "instruction_vote" as const,
    boardRecAllowed: true,
    shareholderSubmittable: false,
  },
  {
    id: "merger_acquisition" as const,
    label: "Merger or Acquisition",
    description: "Instruction on a proposed merger, acquisition, or business combination",
    resolutionType: "special" as const,
    proposerType: "management" as const,
    instructionEventType: "instruction_vote" as const,
    boardRecAllowed: true,
    shareholderSubmittable: false,
  },
  {
    id: "dividend_distribution" as const,
    label: "Distribution Election",
    description: "Elect dividend payout method or distribution preference (e.g. cash vs reinvest)",
    resolutionType: "ordinary" as const,
    proposerType: "management" as const,
    instructionEventType: "election" as const,
    boardRecAllowed: true,
    shareholderSubmittable: false,
  },
  {
    id: "stock_action" as const,
    label: "Stock Action (Split / Reverse Split)",
    description: "Non-elective corporate action — token entitlements updated via registry",
    resolutionType: "ordinary" as const,
    proposerType: "management" as const,
    instructionEventType: "non_elective" as const,
    boardRecAllowed: true,
    shareholderSubmittable: false,
  },
  {
    id: "bylaw_amendment" as const,
    label: "Bylaw / Charter Amendment",
    description: "Instruction on amendments to the corporate charter, bylaws, or articles of incorporation",
    resolutionType: "special" as const,
    proposerType: "management" as const,
    instructionEventType: "instruction_vote" as const,
    boardRecAllowed: true,
    shareholderSubmittable: false,
  },
  {
    id: "capital_action" as const,
    label: "Capital Action (Issuance / Buyback)",
    description: "Instruction on new share issuance, buyback program, or equity offering",
    resolutionType: "special" as const,
    proposerType: "management" as const,
    instructionEventType: "instruction_vote" as const,
    boardRecAllowed: true,
    shareholderSubmittable: false,
  },
  // ── Hodler-submittable categories ─────────────────────────────────────
  {
    id: "shareholder_proposal" as const,
    label: "General Hodler Instruction",
    description: "General instruction for the governance agenda (advisory, non-binding)",
    resolutionType: "advisory" as const,
    proposerType: "shareholder" as const,
    instructionEventType: "instruction_vote" as const,
    boardRecAllowed: false,
    shareholderSubmittable: true,
  },
  {
    id: "shareholder_esg" as const,
    label: "ESG / Sustainability",
    description: "Environmental, social, or governance policy request (e.g. climate disclosure, DEI)",
    resolutionType: "advisory" as const,
    proposerType: "shareholder" as const,
    instructionEventType: "instruction_vote" as const,
    boardRecAllowed: false,
    shareholderSubmittable: true,
  },
  {
    id: "shareholder_exec_comp" as const,
    label: "Executive Compensation Limits",
    description: "Request limits on executive pay, clawback policies, or pay-ratio disclosure",
    resolutionType: "advisory" as const,
    proposerType: "shareholder" as const,
    instructionEventType: "instruction_vote" as const,
    boardRecAllowed: false,
    shareholderSubmittable: true,
  },
  {
    id: "shareholder_governance" as const,
    label: "Governance Reform",
    description: "Request governance changes like proxy access, independent chair, or majority voting",
    resolutionType: "advisory" as const,
    proposerType: "shareholder" as const,
    instructionEventType: "instruction_vote" as const,
    boardRecAllowed: false,
    shareholderSubmittable: true,
  },
  {
    id: "shareholder_transparency" as const,
    label: "Transparency / Disclosure",
    description: "Request additional disclosure on lobbying, political spending, or supply chain",
    resolutionType: "advisory" as const,
    proposerType: "shareholder" as const,
    instructionEventType: "instruction_vote" as const,
    boardRecAllowed: false,
    shareholderSubmittable: true,
  },
  {
    id: "shareholder_rights" as const,
    label: "Hodler Rights",
    description: "Propose special meeting rights, written consent, or anti-takeover repeal",
    resolutionType: "advisory" as const,
    proposerType: "shareholder" as const,
    instructionEventType: "instruction_vote" as const,
    boardRecAllowed: false,
    shareholderSubmittable: true,
  },
  // ── Shared categories ─────────────────────────────────────────────────
  {
    id: "governance" as const,
    label: "Governance Change",
    description: "Changes to governance framework, instruction rules, or quorum thresholds",
    resolutionType: "special" as const,
    proposerType: "management" as const,
    instructionEventType: "instruction_vote" as const,
    boardRecAllowed: true,
    shareholderSubmittable: false,
  },
  {
    id: "other" as const,
    label: "Other",
    description: "Any other matter for hodler consideration",
    resolutionType: "ordinary" as const,
    proposerType: "shareholder" as const,
    instructionEventType: "instruction_vote" as const,
    boardRecAllowed: false,
    shareholderSubmittable: true,
  },
  // ── Community categories (NexBridge platform proposals) ──────────────
  {
    id: "community_new_underlying" as const,
    label: "Request New Underlying",
    description: "Propose a new underlying asset for NexBridge tokenization",
    resolutionType: "advisory" as const,
    proposerType: "community" as const,
    instructionEventType: "instruction_vote" as const,
    boardRecAllowed: false,
    shareholderSubmittable: true,
  },
  {
    id: "community_listing_venue" as const,
    label: "Request Listing Venue",
    description: "Request listing on a new exchange, bank, broker, or venue integration",
    resolutionType: "advisory" as const,
    proposerType: "community" as const,
    instructionEventType: "instruction_vote" as const,
    boardRecAllowed: false,
    shareholderSubmittable: true,
  },
  {
    id: "community_bespoke_product" as const,
    label: "Request Bespoke Product",
    description: "Request a custom instrument with specific parameters (basket, hedged, yield, limits)",
    resolutionType: "advisory" as const,
    proposerType: "community" as const,
    instructionEventType: "instruction_vote" as const,
    boardRecAllowed: false,
    shareholderSubmittable: true,
  },
  {
    id: "community_program_features" as const,
    label: "Request Program Features",
    description: "Suggest portal features, reporting, notifications, corporate actions UX, or APIs",
    resolutionType: "advisory" as const,
    proposerType: "community" as const,
    instructionEventType: "instruction_vote" as const,
    boardRecAllowed: false,
    shareholderSubmittable: true,
  },
  {
    id: "community_market_structure" as const,
    label: "Request Market Structure Changes",
    description: "Propose changes to market structure, trading rules, or settlement processes",
    resolutionType: "advisory" as const,
    proposerType: "community" as const,
    instructionEventType: "instruction_vote" as const,
    boardRecAllowed: false,
    shareholderSubmittable: true,
  },
  {
    id: "community_transparency" as const,
    label: "Documentation & Transparency",
    description: "Request more disclosures, proof-of-reserves format, audit cadence, or terms clarity",
    resolutionType: "advisory" as const,
    proposerType: "community" as const,
    instructionEventType: "instruction_vote" as const,
    boardRecAllowed: false,
    shareholderSubmittable: true,
  },
  {
    id: "community_other" as const,
    label: "Other Community Proposal",
    description: "Any other community feedback or platform suggestion",
    resolutionType: "advisory" as const,
    proposerType: "community" as const,
    instructionEventType: "instruction_vote" as const,
    boardRecAllowed: false,
    shareholderSubmittable: true,
  },
] as const;

export const APP_CONFIG = {
  NAME: "NexTR",
  DESCRIPTION: "On-Chain Hodler-Instruction Governance for NexTR Instruments",
  VERSION: "1.0.0",
} as const;

/**
 * Instruction event type labels for the portal taxonomy.
 * Maps to the three execution pathways in the corporate-action workflow.
 */
export const INSTRUCTION_EVENT_TYPES = [
  {
    id: "instruction_vote" as const,
    label: "Instruction Vote",
    shortLabel: "Instruction",
    description: "Omnibus execution — proxy vote / governance instruction. The Depositary SPV submits a single instruction via the broker/custodian in line with program rules.",
    executionNote: "NexTR records eligible hodler instructions on-chain; the Depositary SPV executes an omnibus instruction via the broker/custodian in line with program rules.",
  },
  {
    id: "election" as const,
    label: "Election",
    shortLabel: "Election",
    description: "Token-level allocation — e.g. cash vs reinvest distribution election. Outcomes are reflected per-hodler at the token level.",
    executionNote: "NexTR records hodler elections; outcomes are reflected at token level (cash payout or reinvestment) pursuant to the Issuance Terms, subject to availability.",
  },
  {
    id: "non_elective" as const,
    label: "Non-Elective Corporate Action",
    shortLabel: "Corporate Action",
    description: "Registry update — split, merger, symbol change. Corporate actions are reflected in token entitlements via registry updates.",
    executionNote: "Corporate actions are reflected in token entitlements via registry updates in accordance with the Issuance Terms.",
  },
] as const;

/**
 * Role clarity labels for the corporate-action workflow diagram.
 */
export const CORPORATE_ACTION_ROLES = {
  depositary_spv: {
    label: "Depositary SPV",
    description: "Legal title holder and trading principal; account holder at broker/custodian; submits instructions; receives corporate action proceeds.",
  },
  broker_custodian: {
    label: "Broker/Custodian",
    description: "Executes trades and processes corporate actions; provides notices/constraints; confirms settlement/custody status.",
  },
  trust_trustee: {
    label: "Trust/Trustee",
    description: "Provides bankruptcy-remote ownership and oversight of the Depositary SPV; ensures actions follow program documentation.",
  },
  program_sponsor: {
    label: "NexBridge (Program Sponsor / Issuer)",
    description: "Defines Issuance Terms and program rules; publishes investor communications; operates the portal under the execution policy.",
  },
  registry_operator: {
    label: "Registry Operator (Reconciliation)",
    description: "Maps token supply and hodler entitlements to off-chain custody holdings and corporate action outcomes; applies token-level accounting updates.",
  },
  settlement_verifier: {
    label: "Settlement Verifier",
    description: "Confirms execution and settlement events (broker/custodian and/or Depositary SPV) and triggers state transitions (e.g., pending → full rights).",
  },
} as const;

/**
 * Legal disclaimers — required visible copy per CEO governance memo.
 */
export const DISCLAIMERS = {
  /** Short execution disclaimer (visible on every page) */
  EXECUTION: "NexTR records eligible hodler instructions on-chain. Execution is performed off-chain by the Depositary SPV via its broker/custodian, under the Trust/Trustee governance, and is subject to the Issuance Terms and service-provider availability.",
  /** One-sentence distinction between omnibus vs token-level */
  OMNIBUS_VS_ALLOCATION: "Some actions are executed as an omnibus instruction (e.g., proxy votes), while other events may be reflected per-hodler at the token level (e.g., cash payout vs reinvestment elections).",
  /** Footer / FAQ disclaimer */
  FOOTER: "NexTR is an informational governance portal for eligible hodlers of NexTR instruments. Participation is subject to eligibility, the applicable Issuance Terms, and service-provider availability. Nothing on this site constitutes an offer or solicitation.",
} as const;
