import type { Translations } from "./types";

export const en: Translations = {
  nav: {
    governance: "Equities Governance",
    community: "NexVoice",
    submitInstruction: "Submit Instruction",
    faq: "FAQ",
  },
  common: {
    backToDashboard: "Back to Dashboard",
    launchApp: "Launch App",
    submitInstruction: "Submit Instruction",
    connectWallet: "Connect Wallet",
    cancel: "Cancel",
    all: "All",
    active: "Active",
    closed: "Closed",
    filter: "Filter:",
    allInstruments: "All Instruments",
    votes: "votes",
    votingPower: "voting power",
    quorum: "quorum",
    quorumReached: "Quorum reached",
    quorumPending: "Quorum pending",
    quorumNotReached: "Quorum Not Reached",
    participation: "Participation",
    totalVotes: "total votes",
    winner: "Winner",
    hodler: "Hodler",
    management: "Management",
    instruction: "Instruction",
    nonBinding: "Non-binding",
    passed: "Passed",
    rejected: "Rejected",
    approvedAdvisory: "Approved (Advisory)",
    liveOnLiquid: "Live on Liquid Network",
    ended: "Ended",
    left: "left",
  },
  home: {
    title: "On-Chain Hodler Instructions for",
    titleHighlight: "Corporate Actions",
    subtitle:
      "NexTR mirrors custodian notices, collects eligible hodler instructions on-chain, and reflects outcomes via a regulated depositary and custody stack.",
    oneLiner:
      "Omnibus actions follow program rules (e.g., majority); allocatable elections may be applied per-hodler at token level.",
    featuresTitle: "Built on Bitcoin-Grade Security",
    featuresSubtitle:
      "NexTR leverages the Liquid Network federated sidechain for institutional-grade hodler-instruction governance.",
    howItWorksTitle: "How It Works",
    howItWorksSubtitle:
      "A simple, transparent process from wallet connection to on-chain instruction verification.",
    features: {
      verifiable: {
        title: "Verifiable On-Chain",
        description:
          "Every hodler instruction is recorded as a Liquid Network transaction with cryptographic proof, auditable by anyone.",
      },
      confidential: {
        title: "Confidential Transactions",
        description:
          "Liquid\u2019s confidential transactions protect hodler balances while maintaining instruction verifiability.",
      },
      finality: {
        title: "2-Minute Finality",
        description:
          "Instructions settle in under 2 minutes with Liquid\u2019s 1-minute block times and 2-confirmation finality.",
      },
      amp: {
        title: "AMP-Secured Assets",
        description:
          "NexTR instruments are Transfer Restricted Assets managed via Blockstream AMP with full KYC compliance.",
      },
    },
    stats: {
      activeEvents: "Active Events",
      instructionsRecorded: "Instructions Recorded",
      instrumentsSupported: "Instruments Supported",
      liquidBlockHeight: "Liquid Block Height",
    },
    steps: {
      s1: {
        title: "Connect Wallet",
        desc: "Link your Blockstream App wallet using your Managed Assets AMP ID. Your token balances determine your instruction weight.",
      },
      s2: {
        title: "Review Events",
        desc: "Browse active instruction events for your NexTR instrument holdings. Each event details the corporate action and available options.",
      },
      s3: {
        title: "Submit Instruction",
        desc: "Select your choice and sign a Liquid transaction. A dust amount is sent as a signal \u2014 you keep all your tokens.",
      },
      s4: {
        title: "Verify On-Chain",
        desc: "Your instruction is recorded as a Liquid Network transaction with an OP_RETURN memo. Anyone can verify the results.",
      },
    },
  },
  dashboard: {
    title: "Governance",
    subtitle:
      "Submit instructions on corporate action events for NexTR instruments",
    activeEvents: "Active Events",
    completed: "Completed",
    supportedInstruments: "Supported Instruments",
    yourHoldings: "Your Holdings",
    holdingsTitle: "Your NexTR Instrument Holdings",
    noEventsFound: "No events found",
  },
  vote: {
    submitYourInstruction: "Submit Your Instruction",
    instructionWeight: "Instruction weight:",
    submitOnChain: "Submit Instruction On-Chain",
    connectWalletTitle: "Connect Your Wallet",
    connectWalletDesc:
      "Connect your Blockstream App wallet to submit your instruction. Your instruction weight is determined by your",
    instructionRecorded: "Instruction Recorded",
    instructionBroadcast: "Instruction Broadcast On-Chain",
    youSelected: "You selected",
    withWeight: "with",
    confirmTitle: "Confirm Your Instruction",
    confirmDescMock:
      "This will record your instruction as a Liquid Network transaction.",
    confirmDescLwk:
      "This will broadcast a real transaction on Liquid testnet.",
    event: "Event",
    yourInstruction: "Your instruction",
    network: "Network",
    fee: "Fee",
    signBroadcast: "Sign & Broadcast",
    signSubmit: "Sign & Submit",
    broadcasting: "Broadcasting...",
    signing: "Signing...",
    securityLwk:
      "Your instruction will be broadcast as a real Liquid testnet transaction. A 1 sat L-BTC dust send is used as the instruction signal. The transaction is signed in-browser via LWK WASM \u2014 your keys never leave the browser.",
    securityMock:
      "Your instruction will be recorded as a Liquid Network transaction with an OP_RETURN memo. You will be prompted to sign the transaction with your wallet. A dust amount of {asset} is sent as an instruction signal \u2014 you do not lose your tokens.",
    viewOnExplorer: "View on Blockstream Explorer",
    instructionFailed: "Instruction failed",
  },
  results: {
    finalResults: "Final Results",
    instructionBreakdown: "Instruction Breakdown",
    participationAndQuorum: "Participation & Quorum",
    eventDetails: "Event Details",
    option: "Option",
    power: "Power",
    verifyAll: "Verify All Instructions on Blockstream Explorer",
    category: "Category",
    resolutionType: "Resolution Type",
    meetingType: "Meeting Type",
    recordDate: "Record Date",
    instructionWindow: "Instruction window",
    snapshotBlock: "Snapshot block",
    totalParticipants: "Total participants",
    totalInstructionWeight: "Total instruction weight",
    approvalThreshold: "Approval threshold",
    advisoryNonBinding: "Advisory (non-binding)",
  },
  create: {
    title: "Submit Instruction",
    subtitle: "Submit a governance instruction for NexTR instrument hodlers",
    walletRequired: "Wallet Required",
    walletRequiredDesc:
      "Connect your Blockstream App wallet to submit governance instructions for NexTR instruments.",
    anyHodlerTitle: "Any token hodler can submit an instruction",
    anyHodlerDesc:
      "Unlike traditional markets requiring $2,000+ in holdings (SEC Rule 14a-8), NexTR allows any hodler \u2014 even with 1 token \u2014 to submit governance instructions. On-chain instruction recording eliminates the administrative costs that justified high thresholds.",
    categoryTitle: "Instruction Category",
    categoryDesc:
      "Select the type of hodler instruction. Management-only actions (board elections, M&A, dividends) are created by the issuer.",
    categoryDescCommunity:
      "Select the topic for your community consultation. All community proposals are advisory and non-binding \u2014 they help NexBridge gauge interest and prioritize.",
    categoryLabel: "Category",
    selectCategory: "Select instruction category",
    resolutionType: "Resolution Type",
    proposerType: "Proposer Type",
    proposerDesc:
      "Submitted by you as a token hodler. Management instructions are created by the issuer.",
    proposerDescCommunity:
      "Submitted by any NexTR instrument hodler as a non-binding community consultation.",
    detailsTitle: "Instruction Details",
    detailsDesc: "Describe the corporate action or governance decision",
    titleLabel: "Title",
    titlePlaceholder:
      "e.g. Annual Dividend Distribution for nAAPL Hodlers",
    summaryLabel: "Summary",
    summaryPlaceholder: "A brief summary for the proposal list",
    fullDescLabel: "Full Description",
    fullDescPlaceholder:
      "Provide full details about the proposal, including rationale, impact, and implementation plan...",
    characters: "characters",
    configuration: "Configuration",
    configurationDesc: "Set the instruction parameters for this event",
    targetAsset: "Target Asset",
    selectAsset: "Select asset",
    quorumRequired: "Quorum Required (%)",
    autoSetNote: "(auto-set by resolution type)",
    instructionWindow: "Instruction Window",
    day: "day",
    days: "days",
    optionsTitle: "Instruction Options",
    optionsDesc:
      "Define the choices hodlers can select (minimum 2, maximum 10)",
    optionLabel: "Option label",
    optionDescPlaceholder: "Description (optional)",
    addOption: "Add Option",
    submitNote:
      "Submitting an instruction requires a Liquid Network transaction. You will be prompted to sign with your wallet.",
    submitting: "Submitting...",
  },
  community: {
    title: "NexBridge Voice",
    subtitle: "Non-binding community consultations for the NexBridge platform and program",
    votingWeightExplainer: "Your voting weight is determined by the total dollar value of all NexTR instruments you hold. Community proposals are advisory and non-binding \u2014 they signal community interest but do not compel action.",
    totalPortfolioValue: "Total Portfolio Value",
    communityProposer: "Community",
    noProposalsFound: "No community proposals found",
    submitCommunityProposal: "Submit Community Proposal",
    allCategories: "All Categories",
    advisoryDisclaimer: "Community proposals are non-binding consultations that gauge community sentiment \u2014 similar to a temperature check. Results signal interest and help NexBridge prioritize, but do not obligate or compel any action. All community proposals are advisory by default.",
    advisoryDisclaimerShort: "Advisory \u00B7 Non-binding",
  },
  voteDetail: {
    time: "Time",
    snapshot: "Snapshot",
    approval: "Approval",
    advisory: "Advisory",
    proposedBy: "Proposed By",
    currentResults: "Current Results",
    timeline: "Timeline",
    created: "Created",
    windowOpened: "Instruction window opened",
    windowCloses: "Instruction window closes",
    blockRange: "Block range",
    instructionVerification: "Instruction Verification",
    verificationDesc:
      "All instructions are recorded on the Liquid Network blockchain and can be independently verified using any Liquid block explorer.",
    verifyOnExplorer: "Verify on Blockstream Explorer",
    boardRecommends: "Board of Directors recommends",
    windowClosed: "Instruction window closed",
    remaining: "remaining",
    advisoryNote:
      "The result is non-binding but the Board considers hodler sentiment in its decisions.",
    quorumNote:
      "A quorum of {quorum}% of total instruction weight must participate for the result to be valid.",
  },
  status: {
    draft: "Draft",
    active: "Active",
    closed: "Closed",
    executed: "Executed",
    cancelled: "Cancelled",
  },
  resolution: {
    ordinary: "Ordinary",
    special: "Special",
    advisory: "Advisory",
    ordinaryFull: "Ordinary Resolution",
    specialFull: "Special Resolution",
    advisoryFull: "Advisory Vote",
    ordinaryDesc: "Requires >50% of votes cast",
    specialDesc: "Requires \u226566.7% of votes cast",
    advisoryDesc: "Non-binding advisory vote",
  },
  meeting: {
    annual: "Annual General Meeting",
    special: "Special Meeting",
    writtenConsent: "Written Consent",
  },
  footer: {
    tagline:
      "NexTR \u2014 On-Chain Governance for Real Tokenized Equity Ownership",
    poweredBy: "Powered by Blockstream AMP & LWK",
    liquidNetwork: "Liquid Network",
  },
  disclaimers: {
    execution:
      "NexTR records eligible hodler instructions on-chain. Execution is performed off-chain by the Depositary SPV via its broker/custodian, under the Trust/Trustee governance, and is subject to the Issuance Terms and service-provider availability.",
    omnibusVsAllocation:
      "Some actions are executed as an omnibus instruction (e.g., proxy votes), while other events may be reflected per-hodler at the token level (e.g., cash payout vs reinvestment elections).",
    footer:
      "NexTR is an informational governance portal for eligible hodlers of NexTR instruments. Participation is subject to eligibility, the applicable Issuance Terms, and service-provider availability. Nothing on this site constitutes an offer or solicitation.",
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle:
      "Learn how on-chain hodler-instruction governance works for NexTR instruments on the Liquid Network.",
    readyToParticipate: "Ready to participate?",
    readyDesc:
      "Connect your wallet and submit instructions on active events.",
    goToDashboard: "Go to Dashboard",
    sections: {
      gettingStarted: "Getting Started",
      governanceWorkflow: "Governance Workflow & Roles",
      instructionEventTypes: "Instruction Event Types",
      eventCategories: "Event Categories",
      hodlerSubmitted: "Hodler-Submitted Instructions",
      quorumAndApproval: "Quorum & Approval Thresholds",
      liquidNetwork: "Liquid Network & Technology",
      onChainDetails: "What's Recorded On-Chain",
      gaidAndWallets: "AMP ID & Wallets",
      securityPrivacy: "Security & Privacy",
    },
    qs: {
      gettingStarted: {
        "What is NexTR?":
          "NexTR is an on-chain governance portal that collects verifiable hodler instructions for NexTR instruments (tokenized equities issued by NexBridge). It records eligible hodler instructions on the Liquid Network blockchain. Execution of those instructions is performed off-chain by the Depositary SPV via its broker/custodian, under Trust/Trustee governance, and subject to the Issuance Terms.",
        "Am I a direct shareholder of Apple, Microsoft, or Tesla?":
          "No. NexTR instrument hodlers are not direct shareholders of the underlying companies. The Depositary SPV is the legal title holder and trading principal. When you submit an instruction through NexTR, you are providing your preference as an eligible hodler of NexTR instruments. The Depositary SPV then executes an omnibus instruction via the broker/custodian in line with program rules.",
        "Which wallet do I need?":
          'NexTR uses Blockstream App wallet with the "Managed Assets" (AMP) account type. NexTR instruments are Transfer Restricted Assets on the Liquid Network, requiring AMP registration. You connect using your AMP ID (AMP Account ID), which uniquely identifies your registered account.',
        "Does WalletConnect work with NexTR?":
          "No. The Liquid Network does not currently support WalletConnect. NexTR uses the AMP ID (AMP Account ID) from your Blockstream App wallet to identify and authenticate your account. This is the standard approach for AMP-managed assets on Liquid.",
        "What instruments can I participate with?":
          "You can submit instructions for any NexTR instrument you hold, including nAAPL (Apple), nMSFT (Microsoft), nTSLA (Tesla), nSPY (S&P 500), nNSDQ (Nasdaq 100), and USTBL (US Treasury Bills). Your instruction weight equals the number of tokens you hold at the snapshot block.",
      },
      governanceWorkflow: {
        "What is the Depositary SPV?":
          "The Depositary SPV is the legal title holder and trading principal for the underlying securities. It is the account holder at the broker/custodian, submits instructions on behalf of all hodlers, and receives corporate action proceeds. It operates under the oversight of the Trust/Trustee.",
        "What role does NexBridge play?":
          "NexBridge is the Program Sponsor and Issuer. It defines the Issuance Terms and program rules, publishes investor communications, and operates this portal under the execution policy. NexBridge does not hold the underlying securities directly \u2014 that is the Depositary SPV.",
        "What is the Trust/Trustee role?":
          "The Trust/Trustee provides bankruptcy-remote ownership and oversight of the Depositary SPV. It ensures that all actions follow the program documentation and that the interests of instrument hodlers are protected.",
        "How do instructions flow from NexTR to execution?":
          "The workflow is: (1) Hodlers submit on-chain instructions via NexTR, (2) NexTR aggregates and records eligible instructions, (3) The Depositary SPV receives the aggregate result, (4) The Depositary SPV submits an omnibus instruction to its broker/custodian, (5) The broker/custodian executes the instruction at the issuer level. For elections (e.g. cash vs reinvest), outcomes are reflected per-hodler at the token level.",
      },
      instructionEventTypes: {
        "What is an Instruction Vote?":
          "An Instruction Vote is an event where hodlers provide their governance preference (e.g. For, Against, Abstain on a proxy vote item). It uses omnibus execution: the Depositary SPV submits a single aggregated instruction via the broker/custodian. This is how proxy votes, board elections, and say-on-pay items are handled.",
        "What is an Election?":
          "An Election is an event where hodlers choose between allocatable options \u2014 for example, receiving a distribution as cash or reinvesting it. Unlike instruction votes, election outcomes are reflected per-hodler at the token level (cash payout vs reinvestment) pursuant to the Issuance Terms.",
        "What is a Non-Elective Corporate Action?":
          "Non-elective corporate actions (stock splits, mergers, symbol changes) do not require hodler instructions. They are automatically reflected in token entitlements via registry updates in accordance with the Issuance Terms. NexTR displays these as informational events.",
        "Do I lose my tokens when I submit an instruction?":
          "No. Submitting an instruction sends a dust amount (1 satoshi) of L-BTC as a signal transaction. This is negligible and serves only to create a verifiable on-chain record. Your token balance remains effectively unchanged.",
        "Can I change my instruction after submitting?":
          "No. Once an instruction is broadcast on the Liquid Network, it is immutable. This mirrors traditional proxy voting where ballots are final once submitted. Consider your choice carefully before confirming.",
        "Can I verify my instruction was recorded?":
          "Yes. Every instruction is a Liquid Network transaction that can be independently verified using the Blockstream Explorer. The transaction ID is shown after you submit, and you can look it up at any time.",
      },
      eventCategories: {
        "What types of events does NexTR support?":
          "NexTR supports the same categories found in traditional institutional governance: Board of Directors Elections, Say-on-Pay (executive compensation), Auditor Ratification, Mergers & Acquisitions, Distribution Elections, Stock Actions (splits), Bylaw Amendments, Capital Actions (issuance/buyback), Hodler Instructions, and Governance Changes.",
        "What is an Ordinary Resolution?":
          "An ordinary resolution requires approval by more than 50% of instructions cast, with a 10% quorum (minimum participation). This applies to routine matters like board elections and distribution elections.",
        "What is a Special Resolution?":
          "A special resolution requires approval by at least 66.7% (two-thirds supermajority) of instructions cast, with a higher 25% quorum. This applies to significant changes like mergers, bylaw amendments, capital actions, and governance changes.",
        "What is an Advisory Vote?":
          "Advisory instructions are non-binding \u2014 the result expresses hodler sentiment but does not legally compel the board. Say-on-Pay, auditor ratifications, and hodler-submitted instructions are typically advisory. The board is expected to consider the result.",
        "What does the Board Recommendation mean?":
          'For management-initiated events, the Board of Directors provides a recommendation (usually "FOR"). This is similar to proxy statements in traditional finance. Hodler-submitted instructions typically do not carry a board recommendation.',
      },
      hodlerSubmitted: {
        "Can I submit an instruction if I only hold 1 token?":
          "Yes. Unlike traditional markets where SEC Rule 14a-8 requires $2,000 to $25,000 in holdings, NexTR allows any hodler \u2014 even with just 1 token \u2014 to submit a governance instruction. On-chain governance eliminates the administrative overhead that justified those high traditional thresholds.",
        "What are the requirements to submit an instruction?":
          "You need: (1) At least 1 token of any NexTR instrument, (2) A holding period of at least 1,440 blocks (~1 day) before submitting, and (3) A connected Blockstream App wallet.",
        "Are there limits on resubmitting failed instructions?":
          "Yes. Adapted from SEC resubmission rules, if an instruction receives less than 5% support on the first attempt, it cannot be resubmitted for 3 years. The threshold rises to 15% on the second attempt and 25% on the third. This prevents spam while allowing popular ideas to be reconsidered.",
        "What is the difference between Management and Hodler instructions?":
          "Management instructions are initiated by the board or company leadership (e.g., board elections, distribution approvals, M&A). Hodler instructions are submitted by individual token hodlers to put issues on the agenda. Management instructions may carry a board recommendation; hodler instructions are typically advisory.",
      },
      quorumAndApproval: {
        "What is a quorum?":
          "Quorum is the minimum percentage of total instruction weight that must participate for a result to be valid. If quorum is not reached, the event fails regardless of the instruction outcome.",
        "What are the quorum thresholds?":
          "Ordinary resolutions require 10% quorum. Special resolutions require 25% quorum. Advisory instructions also use 10% quorum, though as non-binding the board may still consider the result.",
        "What is the Record Date?":
          'The Record Date (equivalent to the "snapshot block" on-chain) determines which hodlers are eligible to participate and their instruction weight. Only hodlers at the Record Date can submit instructions.',
      },
      liquidNetwork: {
        "Why is NexTR built on the Liquid Network?":
          "The Liquid Network is a Bitcoin sidechain designed for financial assets. It offers: 1-minute block times (vs 10 min on Bitcoin), Confidential Transactions that hide amounts and asset types from third-party observers, Transfer Restricted Assets via AMP for regulatory compliance, and the security guarantees of a federated Bitcoin sidechain.",
        "What is AMP and why does it matter?":
          "AMP (Asset Management Platform) by Blockstream manages Transfer Restricted Assets on Liquid. NexTR instruments are AMP-managed, meaning only registered (KYC-verified) users can hold and transfer them. This ensures regulatory compliance while maintaining on-chain transparency. In production, the AMP API verifies a hodler's token balance at the snapshot block.",
        "How are instructions recorded on-chain?":
          "Each instruction is a Liquid transaction that sends 1 satoshi of L-BTC (not the equity token) to the hodler's own address \u2014 a self-spend. This creates a publicly verifiable proof-of-participation. The actual instruction choice (For/Against/Abstain) is registered off-chain with the backend, linked to the on-chain txid. A future enhancement will embed a NEXTR_VOTE memo in an OP_RETURN output for full on-chain auditability.",
        "What is a PSET?":
          "PSET (Partially Signed Elements Transaction) is Liquid's equivalent of Bitcoin's PSBT. When you submit an instruction, NexTR constructs a PSET containing the dust L-BTC transaction, which is signed using the LWK (Liquid Wallet Kit) signer. The signed PSET is finalized and broadcast to the Liquid network via the Esplora API.",
        "What is LWK (Liquid Wallet Kit)?":
          "LWK is a WASM-based library by Blockstream for building Liquid wallets directly in the browser. NexTR uses LWK to create and manage wallets on Liquid testnet \u2014 generating mnemonics, deriving SLIP-77 blinded descriptors, syncing UTXOs via Esplora, building PSETs, signing, and broadcasting transactions. All of this runs client-side without sending keys to a server.",
      },
      onChainDetails: {
        "What exactly is the instruction transaction?":
          "The instruction transaction is a simple self-spend: your LWK wallet sends 1 satoshi of L-BTC to your own address. That's it. No equity tokens are moved, no instruction metadata is embedded in the current implementation. The transaction serves as an immutable proof-of-participation anchor on the Liquid blockchain.",
        "What data is visible on the blockchain?":
          "Due to Liquid's Confidential Transactions, very little is visible. An outside observer sees: (1) that a transaction occurred between addresses, and (2) the transaction fee. The amount (1 sat), the asset type (L-BTC), and the fact that it's a self-spend are all blinded. No holdings, no instruction choice, no AMP ID, and no event information appears on-chain.",
        "What is NOT on-chain?":
          "The following data is NOT recorded on the blockchain: your instruction choice (For/Against/Abstain), the event ID, your AMP ID, your instruction weight, your token holdings (nAAPL, nMSFT, etc.), and the NEXTR_VOTE memo. All of this is managed off-chain by the backend, linked to the on-chain txid.",
        "How does the backend know what I instructed?":
          "After the dust transaction is broadcast and a txid is obtained, the wallet calls a backend registration endpoint with the txid, event ID, option ID, and your address. The txid is the cryptographic link between your on-chain action and your off-chain instruction record. This two-layer approach keeps holdings private while maintaining verifiability.",
        "Will instructions be fully auditable on-chain in the future?":
          "Yes. The codebase includes an instruction memo format (NEXTR_VOTE:<eventId>:<optionId>:<holderAmpId>) designed to be embedded in an OP_RETURN output. Once LWK's TxBuilder supports OP_RETURN natively, this memo will be added to instruction transactions \u2014 making choices independently auditable on-chain without revealing holdings.",
      },
      gaidAndWallets: {
        "What is an AMP ID?":
          "An AMP ID (AMP Account ID) is the unique identifier for your account in Blockstream App wallet. It's an alphanumeric string (10-100 characters) that identifies your AMP-registered account. You can find it in Blockstream App under Managed Assets \u2192 Receive. The AMP ID is how the platform knows which registered hodler you are.",
        "What is the difference between AMP ID mode and LWK mode?":
          "AMP ID mode connects using your Blockstream App account ID \u2014 the production path for KYC-verified hodlers. LWK mode creates a real Liquid testnet wallet in your browser using Liquid Wallet Kit (WASM) for testing real on-chain transactions. In production, both modes produce real on-chain transactions.",
        "Is the LWK wallet created per session or is it persistent?":
          "Both. The LWK WASM objects (wallet, signer, Esplora client) are created in-memory and exist only for the current browser session. However, the mnemonic phrase and derived address are persisted in localStorage, so the wallet can be automatically restored when you return. There is no server-side database storing your wallet \u2014 everything lives in your browser.",
        "How is the AMP ID linked to the LWK wallet?":
          "In AMP ID mode, the AMP ID you provide is used directly as your identity, and an LWK signing wallet is auto-provisioned and linked server-side. In LWK-only mode, the first 20 characters of your real Liquid testnet address serve as a pseudo-AMP-ID. In production, the AMP ID is the authoritative identity, with the AMP API used to verify your holdings at the snapshot block.",
        "Is my mnemonic safe in localStorage?":
          "For testnet usage, localStorage is acceptable. For production, storing a mnemonic in localStorage is a security risk \u2014 it doesn't survive across devices and is vulnerable to XSS attacks. The production architecture associates wallets server-side with your AMP ID, encrypted at rest, or relies entirely on Blockstream App / Jade hardware signing.",
      },
      securityPrivacy: {
        "Are my holdings (nAAPL, nMSFT, etc.) visible when I submit an instruction?":
          "No. Your token holdings are never exposed on-chain when you submit an instruction. The transaction only moves 1 sat of L-BTC \u2014 no equity tokens are touched or transferred. Furthermore, Liquid's Confidential Transactions blind even the L-BTC amount and asset type from third-party observers. Nobody looking at the blockchain can see what tokens you hold or how many.",
        "What exactly can someone see on the blockchain?":
          "An outside observer can only see that a particular address sent a blinded transaction to itself. They cannot see: (1) the amount (1 sat, blinded by CT), (2) the asset type (L-BTC, blinded by CT), (3) your instruction choice (stored off-chain), (4) your token holdings, or (5) your instruction weight. The transaction is essentially opaque to third parties.",
        "Is my instruction choice (For/Against) private?":
          "Currently, yes \u2014 your instruction choice is registered off-chain with the backend and linked to your on-chain txid. It is not embedded in the transaction itself. In a future production version, an OP_RETURN memo may be added for full auditability, which would make the choice publicly readable. However, even then, your holdings and instruction weight would remain private.",
        "Can instructions be manipulated?":
          "Instruction integrity is protected by multiple mechanisms: (1) Snapshot-based weight prevents token buying after event creation, (2) One-instruction-per-hodler prevents duplicates, (3) Liquid's blockchain immutability prevents transaction alteration, (4) Each instruction is anchored to a verifiable on-chain txid, and (5) AMP registration ensures only KYC-verified hodlers participate.",
        "What happens if the platform goes down during an instruction window?":
          "Instructions already submitted are permanently recorded on the Liquid blockchain regardless of platform status. The instruction window is measured in blocks, not real time, so temporary platform downtime does not affect the window. The on-chain txid serves as immutable proof that you participated.",
      },
    },
  },
  categories: {
    board_election: "Board of Directors Election",
    say_on_pay: "Say-on-Pay (Executive Compensation)",
    auditor_ratification: "Auditor Ratification",
    merger_acquisition: "Merger or Acquisition",
    dividend_distribution: "Distribution Election",
    stock_action: "Stock Action (Split / Reverse Split)",
    bylaw_amendment: "Bylaw / Charter Amendment",
    capital_action: "Capital Action (Issuance / Buyback)",
    shareholder_proposal: "General Hodler Instruction",
    shareholder_esg: "ESG / Sustainability",
    shareholder_exec_comp: "Executive Compensation Limits",
    shareholder_governance: "Governance Reform",
    shareholder_transparency: "Transparency / Disclosure",
    shareholder_rights: "Hodler Rights",
    governance: "Governance Change",
    other: "Other",
    community_new_underlying: "Request New Underlying",
    community_listing_venue: "Request Listing Venue",
    community_bespoke_product: "Request Bespoke Product",
    community_program_features: "Request Program Features",
    community_market_structure: "Market Structure Changes",
    community_transparency: "Documentation & Transparency",
    community_other: "Other Community Proposal",
  },
  categoryDescs: {
    board_election: "Elect or re-elect members of the board of directors",
    say_on_pay: "Advisory instruction on executive compensation packages",
    auditor_ratification:
      "Ratify appointment of external auditor / accounting firm",
    merger_acquisition:
      "Instruction on a proposed merger, acquisition, or business combination",
    dividend_distribution:
      "Elect dividend payout method or distribution preference (e.g. cash vs reinvest)",
    stock_action:
      "Non-elective corporate action \u2014 token entitlements updated via registry",
    bylaw_amendment:
      "Instruction on amendments to the corporate charter, bylaws, or articles of incorporation",
    capital_action:
      "Instruction on new share issuance, buyback program, or equity offering",
    shareholder_proposal:
      "General instruction for the governance agenda (advisory, non-binding)",
    shareholder_esg:
      "Environmental, social, or governance policy request (e.g. climate disclosure, DEI)",
    shareholder_exec_comp:
      "Request limits on executive pay, clawback policies, or pay-ratio disclosure",
    shareholder_governance:
      "Request governance changes like proxy access, independent chair, or majority voting",
    shareholder_transparency:
      "Request additional disclosure on lobbying, political spending, or supply chain",
    shareholder_rights:
      "Propose special meeting rights, written consent, or anti-takeover repeal",
    governance:
      "Changes to governance framework, instruction rules, or quorum thresholds",
    other: "Any other matter for hodler consideration",
    community_new_underlying: "Propose a new underlying asset for NexBridge tokenization (e.g. 'I want exposure to [asset]')",
    community_listing_venue: "Request listing on a new exchange, bank, broker, or venue integration",
    community_bespoke_product: "Request a custom instrument with specific parameters (basket, hedged, yield, limits)",
    community_program_features: "Suggest portal features, reporting, notifications, corporate actions UX, or APIs",
    community_market_structure: "Propose changes to market structure, trading rules, or settlement processes",
    community_transparency: "Request more disclosures, proof-of-reserves format, audit cadence, or terms clarity",
    community_other: "Any other community feedback or platform suggestion",
  },
};
