export const LOCALES = ["en", "es", "it", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export interface LocaleConfig {
  code: Locale;
  nativeLabel: string;
  flag: string;
}

export const LOCALE_CONFIGS: LocaleConfig[] = [
  { code: "en", nativeLabel: "English", flag: "\uD83C\uDDEC\uD83C\uDDE7" },
  { code: "es", nativeLabel: "Espa\u00f1ol", flag: "\uD83C\uDDEA\uD83C\uDDF8" },
  { code: "it", nativeLabel: "Italiano", flag: "\uD83C\uDDEE\uD83C\uDDF9" },
  { code: "fr", nativeLabel: "Fran\u00e7ais", flag: "\uD83C\uDDEB\uD83C\uDDF7" },
];

export interface Translations {
  nav: {
    governance: string;
    community: string;
    submitInstruction: string;
    faq: string;
  };
  common: {
    backToDashboard: string;
    launchApp: string;
    submitInstruction: string;
    connectWallet: string;
    cancel: string;
    all: string;
    active: string;
    closed: string;
    filter: string;
    allInstruments: string;
    votes: string;
    votingPower: string;
    quorum: string;
    quorumReached: string;
    quorumPending: string;
    quorumNotReached: string;
    participation: string;
    totalVotes: string;
    winner: string;
    hodler: string;
    management: string;
    instruction: string;
    nonBinding: string;
    passed: string;
    rejected: string;
    approvedAdvisory: string;
    liveOnLiquid: string;
    ended: string;
    left: string;
  };
  home: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    oneLiner: string;
    featuresTitle: string;
    featuresSubtitle: string;
    howItWorksTitle: string;
    howItWorksSubtitle: string;
    features: {
      verifiable: { title: string; description: string };
      confidential: { title: string; description: string };
      finality: { title: string; description: string };
      amp: { title: string; description: string };
    };
    stats: {
      activeEvents: string;
      instructionsRecorded: string;
      instrumentsSupported: string;
      liquidBlockHeight: string;
    };
    steps: {
      s1: { title: string; desc: string };
      s2: { title: string; desc: string };
      s3: { title: string; desc: string };
      s4: { title: string; desc: string };
    };
  };
  dashboard: {
    title: string;
    subtitle: string;
    activeEvents: string;
    completed: string;
    supportedInstruments: string;
    yourHoldings: string;
    holdingsTitle: string;
    noEventsFound: string;
  };
  vote: {
    submitYourInstruction: string;
    instructionWeight: string;
    submitOnChain: string;
    connectWalletTitle: string;
    connectWalletDesc: string;
    instructionRecorded: string;
    instructionBroadcast: string;
    youSelected: string;
    withWeight: string;
    confirmTitle: string;
    confirmDescMock: string;
    confirmDescLwk: string;
    event: string;
    yourInstruction: string;
    network: string;
    fee: string;
    signBroadcast: string;
    signSubmit: string;
    broadcasting: string;
    signing: string;
    securityLwk: string;
    securityMock: string;
    viewOnExplorer: string;
    instructionFailed: string;
  };
  results: {
    finalResults: string;
    instructionBreakdown: string;
    participationAndQuorum: string;
    eventDetails: string;
    option: string;
    power: string;
    verifyAll: string;
    category: string;
    resolutionType: string;
    meetingType: string;
    recordDate: string;
    instructionWindow: string;
    snapshotBlock: string;
    totalParticipants: string;
    totalInstructionWeight: string;
    approvalThreshold: string;
    advisoryNonBinding: string;
  };
  create: {
    title: string;
    subtitle: string;
    walletRequired: string;
    walletRequiredDesc: string;
    anyHodlerTitle: string;
    anyHodlerDesc: string;
    categoryTitle: string;
    categoryDesc: string;
    categoryDescCommunity: string;
    categoryLabel: string;
    selectCategory: string;
    resolutionType: string;
    proposerType: string;
    proposerDesc: string;
    proposerDescCommunity: string;
    detailsTitle: string;
    detailsDesc: string;
    titleLabel: string;
    titlePlaceholder: string;
    summaryLabel: string;
    summaryPlaceholder: string;
    fullDescLabel: string;
    fullDescPlaceholder: string;
    characters: string;
    configuration: string;
    configurationDesc: string;
    targetAsset: string;
    selectAsset: string;
    quorumRequired: string;
    autoSetNote: string;
    instructionWindow: string;
    day: string;
    days: string;
    optionsTitle: string;
    optionsDesc: string;
    optionLabel: string;
    optionDescPlaceholder: string;
    addOption: string;
    submitNote: string;
    submitting: string;
  };
  community: {
    title: string;
    subtitle: string;
    votingWeightExplainer: string;
    totalPortfolioValue: string;
    communityProposer: string;
    noProposalsFound: string;
    submitCommunityProposal: string;
    allCategories: string;
    advisoryDisclaimer: string;
    advisoryDisclaimerShort: string;
  };
  voteDetail: {
    time: string;
    snapshot: string;
    approval: string;
    advisory: string;
    proposedBy: string;
    currentResults: string;
    timeline: string;
    created: string;
    windowOpened: string;
    windowCloses: string;
    blockRange: string;
    instructionVerification: string;
    verificationDesc: string;
    verifyOnExplorer: string;
    boardRecommends: string;
    windowClosed: string;
    remaining: string;
    advisoryNote: string;
    quorumNote: string;
  };
  status: {
    draft: string;
    active: string;
    closed: string;
    executed: string;
    cancelled: string;
  };
  resolution: {
    ordinary: string;
    special: string;
    advisory: string;
    ordinaryFull: string;
    specialFull: string;
    advisoryFull: string;
    ordinaryDesc: string;
    specialDesc: string;
    advisoryDesc: string;
  };
  meeting: {
    annual: string;
    special: string;
    writtenConsent: string;
  };
  footer: {
    tagline: string;
    poweredBy: string;
    liquidNetwork: string;
  };
  disclaimers: {
    execution: string;
    omnibusVsAllocation: string;
    footer: string;
  };
  faq: {
    title: string;
    subtitle: string;
    readyToParticipate: string;
    readyDesc: string;
    goToDashboard: string;
    sections: {
      gettingStarted: string;
      governanceWorkflow: string;
      instructionEventTypes: string;
      eventCategories: string;
      hodlerSubmitted: string;
      quorumAndApproval: string;
      liquidNetwork: string;
      onChainDetails: string;
      gaidAndWallets: string;
      securityPrivacy: string;
    };
    qs: Record<string, Record<string, string>>;
  };
  categories: Record<string, string>;
  categoryDescs: Record<string, string>;
}
