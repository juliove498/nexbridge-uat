import type { Translations } from "./types";

export const fr: Translations = {
  nav: {
    governance: "Gouvernance Actions",
    community: "NexVoice",
    submitInstruction: "Soumettre une instruction",
    faq: "FAQ",
  },
  common: {
    backToDashboard: "Retour au tableau de bord",
    launchApp: "Lancer l'application",
    submitInstruction: "Soumettre une instruction",
    connectWallet: "Connecter le wallet",
    cancel: "Annuler",
    all: "Tous",
    active: "Actif",
    closed: "Fermé",
    filter: "Filtre :",
    allInstruments: "Tous les instruments",
    votes: "votes",
    votingPower: "pouvoir de vote",
    quorum: "quorum",
    quorumReached: "Quorum atteint",
    quorumPending: "Quorum en attente",
    quorumNotReached: "Quorum non atteint",
    participation: "Participation",
    totalVotes: "votes totaux",
    winner: "Gagnant",
    hodler: "Hodler",
    management: "Direction",
    instruction: "Instruction",
    nonBinding: "Non contraignant",
    passed: "Adopté",
    rejected: "Rejeté",
    approvedAdvisory: "Approuvé (consultatif)",
    liveOnLiquid: "En direct sur Liquid Network",
    ended: "Terminé",
    left: "restant",
  },
  home: {
    title: "Instructions on-chain des Hodlers pour les",
    titleHighlight: "Actions d'entreprise",
    subtitle:
      "NexTR reproduit les avis du dépositaire, collecte les instructions des Hodlers éligibles on-chain et reflète les résultats via une pile de dépositaire et de garde réglementée.",
    oneLiner:
      "Les actions omnibus suivent les règles du programme (ex. : majorité) ; les choix allouables peuvent être appliqués par Hodler au niveau des tokens.",
    featuresTitle: "Construit sur la sécurité de niveau Bitcoin",
    featuresSubtitle:
      "NexTR exploite la sidechain fédérée Liquid Network pour une gouvernance des instructions Hodlers de niveau institutionnel.",
    howItWorksTitle: "Comment ça fonctionne",
    howItWorksSubtitle:
      "Un processus simple et transparent, de la connexion du wallet à la vérification de l'instruction on-chain.",
    features: {
      verifiable: {
        title: "Vérifiable on-chain",
        description:
          "Chaque instruction de Hodler est enregistrée comme une transaction Liquid Network avec une preuve cryptographique, vérifiable par tous.",
      },
      confidential: {
        title: "Transactions confidentielles",
        description:
          "Les transactions confidentielles de Liquid protègent les soldes des Hodlers tout en maintenant la vérifiabilité des instructions.",
      },
      finality: {
        title: "Finalité en 2 minutes",
        description:
          "Les instructions sont réglées en moins de 2 minutes grâce aux temps de bloc de 1 minute de Liquid et à la finalité en 2 confirmations.",
      },
      amp: {
        title: "Actifs sécurisés par AMP",
        description:
          "Les instruments NexTR sont des Transfer Restricted Assets gérés via Blockstream AMP avec conformité KYC complète.",
      },
    },
    stats: {
      activeEvents: "Événements actifs",
      instructionsRecorded: "Instructions enregistrées",
      instrumentsSupported: "Instruments pris en charge",
      liquidBlockHeight: "Hauteur de bloc Liquid",
    },
    steps: {
      s1: {
        title: "Connecter le wallet",
        desc: "Liez votre wallet Blockstream App en utilisant votre AMP ID Managed Assets. Vos soldes de tokens déterminent le poids de votre instruction.",
      },
      s2: {
        title: "Consulter les événements",
        desc: "Parcourez les événements d'instruction actifs pour vos participations dans les instruments NexTR. Chaque événement détaille l'action d'entreprise et les options disponibles.",
      },
      s3: {
        title: "Soumettre l'instruction",
        desc: "Sélectionnez votre choix et signez une transaction Liquid. Un montant dust amount est envoyé comme signal — vous conservez tous vos tokens.",
      },
      s4: {
        title: "Vérifier on-chain",
        desc: "Votre instruction est enregistrée comme une transaction Liquid Network avec un mémo OP_RETURN. Tout le monde peut vérifier les résultats.",
      },
    },
  },
  dashboard: {
    title: "Gouvernance",
    subtitle:
      "Soumettre des instructions sur les événements d'actions d'entreprise pour les instruments NexTR",
    activeEvents: "Événements actifs",
    completed: "Terminés",
    supportedInstruments: "Instruments pris en charge",
    yourHoldings: "Vos participations",
    holdingsTitle: "Vos participations dans les instruments NexTR",
    noEventsFound: "Aucun événement trouvé",
  },
  vote: {
    submitYourInstruction: "Soumettre votre instruction",
    instructionWeight: "Poids de l'instruction :",
    submitOnChain: "Soumettre l'instruction on-chain",
    connectWalletTitle: "Connecter votre wallet",
    connectWalletDesc:
      "Connectez votre wallet Blockstream App pour soumettre votre instruction. Le poids de votre instruction est déterminé par votre",
    instructionRecorded: "Instruction enregistrée",
    instructionBroadcast: "Instruction diffusée on-chain",
    youSelected: "Vous avez sélectionné",
    withWeight: "avec",
    confirmTitle: "Confirmer votre instruction",
    confirmDescMock:
      "Cela enregistrera votre instruction comme une transaction Liquid Network.",
    confirmDescLwk:
      "Cela diffusera une transaction réelle sur le testnet Liquid.",
    event: "Événement",
    yourInstruction: "Votre instruction",
    network: "Réseau",
    fee: "Frais",
    signBroadcast: "Signer et diffuser",
    signSubmit: "Signer et soumettre",
    broadcasting: "Diffusion...",
    signing: "Signature...",
    securityLwk:
      "Votre instruction sera diffusée comme une transaction réelle sur le testnet Liquid. Un envoi dust de 1 sat L-BTC est utilisé comme signal d'instruction. La transaction est signée dans le navigateur via LWK WASM — vos clés ne quittent jamais le navigateur.",
    securityMock:
      "Votre instruction sera enregistrée comme une transaction Liquid Network avec un mémo OP_RETURN. Vous serez invité à signer la transaction avec votre wallet. Un montant dust de {asset} est envoyé comme signal d'instruction — vous ne perdez pas vos tokens.",
    viewOnExplorer: "Voir sur Blockstream Explorer",
    instructionFailed: "Échec de l'instruction",
  },
  results: {
    finalResults: "Résultats finaux",
    instructionBreakdown: "Répartition des instructions",
    participationAndQuorum: "Participation et quorum",
    eventDetails: "Détails de l'événement",
    option: "Option",
    power: "Pouvoir",
    verifyAll: "Vérifier toutes les instructions sur Blockstream Explorer",
    category: "Catégorie",
    resolutionType: "Type de résolution",
    meetingType: "Type de réunion",
    recordDate: "Date d'enregistrement",
    instructionWindow: "Fenêtre d'instruction",
    snapshotBlock: "snapshot block",
    totalParticipants: "Total de participants",
    totalInstructionWeight: "Poids total des instructions",
    approvalThreshold: "Seuil d'approbation",
    advisoryNonBinding: "Consultatif (non contraignant)",
  },
  create: {
    title: "Soumettre une instruction",
    subtitle: "Soumettre une instruction de gouvernance pour les Hodlers d'instruments NexTR",
    walletRequired: "Wallet requis",
    walletRequiredDesc:
      "Connectez votre wallet Blockstream App pour soumettre des instructions de gouvernance pour les instruments NexTR.",
    anyHodlerTitle: "Tout détenteur de token peut soumettre une instruction",
    anyHodlerDesc:
      "Contrairement aux marchés traditionnels exigeant plus de 2 000 $ en participations (SEC Rule 14a-8), NexTR permet à tout Hodler — même avec 1 token — de soumettre des instructions de gouvernance. L'enregistrement des instructions on-chain élimine les coûts administratifs qui justifiaient ces seuils élevés.",
    categoryTitle: "Catégorie d'instruction",
    categoryDesc:
      "Sélectionnez le type d'instruction de Hodler. Les actions réservées à la direction (élections du conseil, fusions-acquisitions, dividendes) sont créées par l'émetteur.",
    categoryDescCommunity: "Sélectionnez le sujet de votre consultation communautaire. Toutes les propositions communautaires sont consultatives et non contraignantes — elles aident NexBridge à évaluer l'intérêt et à prioriser.",
    categoryLabel: "Catégorie",
    selectCategory: "Sélectionnez la catégorie d'instruction",
    resolutionType: "Type de résolution",
    proposerType: "Type de proposant",
    proposerDesc:
      "Soumis par vous en tant que détenteur de token. Les instructions de la direction sont créées par l'émetteur.",
    proposerDescCommunity: "Soumise par tout détenteur d'instruments NexTR comme consultation communautaire non contraignante.",
    detailsTitle: "Détails de l'instruction",
    detailsDesc: "Décrivez l'action d'entreprise ou la décision de gouvernance",
    titleLabel: "Titre",
    titlePlaceholder:
      "ex. Distribution annuelle de dividendes pour les Hodlers nAAPL",
    summaryLabel: "Résumé",
    summaryPlaceholder: "Un bref résumé pour la liste des propositions",
    fullDescLabel: "Description complète",
    fullDescPlaceholder:
      "Fournissez tous les détails sur la proposition, y compris la justification, l'impact et le plan de mise en œuvre...",
    characters: "caractères",
    configuration: "Configuration",
    configurationDesc: "Définir les paramètres d'instruction pour cet événement",
    targetAsset: "Actif cible",
    selectAsset: "Sélectionner l'actif",
    quorumRequired: "Quorum requis (%)",
    autoSetNote: "(défini automatiquement par type de résolution)",
    instructionWindow: "Fenêtre d'instruction",
    day: "jour",
    days: "jours",
    optionsTitle: "Options d'instruction",
    optionsDesc:
      "Définissez les choix que les Hodlers peuvent sélectionner (minimum 2, maximum 10)",
    optionLabel: "Libellé de l'option",
    optionDescPlaceholder: "Description (facultatif)",
    addOption: "Ajouter une option",
    submitNote:
      "La soumission d'une instruction nécessite une transaction Liquid Network. Vous serez invité à signer avec votre wallet.",
    submitting: "Soumission...",
  },
  community: {
    title: "NexBridge Voice",
    subtitle: "Consultations communautaires non contraignantes pour la plateforme et le programme NexBridge",
    votingWeightExplainer: "Votre poids de vote est déterminé par la valeur totale en dollars de tous les instruments NexTR que vous détenez. Les propositions communautaires sont consultatives et non contraignantes — elles signalent l'intérêt de la communauté mais n'imposent aucune action.",
    totalPortfolioValue: "Valeur Totale du Portefeuille",
    communityProposer: "Communauté",
    noProposalsFound: "Aucune proposition communautaire trouvée",
    submitCommunityProposal: "Soumettre une Proposition Communautaire",
    allCategories: "Toutes les Catégories",
    advisoryDisclaimer: "Les propositions communautaires sont des consultations non contraignantes qui mesurent le sentiment de la communauté — similaire à une vérification de température. Les résultats signalent l'intérêt et aident NexBridge à prioriser, mais n'obligent ni n'imposent aucune action. Toutes les propositions communautaires sont consultatives par défaut.",
    advisoryDisclaimerShort: "Consultatif · Non contraignant",
  },
  voteDetail: {
    time: "Temps",
    snapshot: "Snapshot",
    approval: "Approbation",
    advisory: "Consultatif",
    proposedBy: "Proposé par",
    currentResults: "Résultats actuels",
    timeline: "Chronologie",
    created: "Créé",
    windowOpened: "Fenêtre d'instruction ouverte",
    windowCloses: "Fermeture de la fenêtre d'instruction",
    blockRange: "Plage de blocs",
    instructionVerification: "Vérification des instructions",
    verificationDesc:
      "Toutes les instructions sont enregistrées sur la blockchain Liquid Network et peuvent être vérifiées de manière indépendante à l'aide de n'importe quel explorateur de blocs Liquid.",
    verifyOnExplorer: "Vérifier sur Blockstream Explorer",
    boardRecommends: "Le Conseil d'Administration recommande",
    windowClosed: "Fenêtre d'instruction fermée",
    remaining: "restant",
    advisoryNote:
      "Le résultat est non contraignant mais le Conseil prend en compte le sentiment des Hodlers dans ses décisions.",
    quorumNote:
      "Un quorum de {quorum}% du poids total des instructions doit participer pour que le résultat soit valide.",
  },
  status: {
    draft: "Brouillon",
    active: "Actif",
    closed: "Fermé",
    executed: "Exécuté",
    cancelled: "Annulé",
  },
  resolution: {
    ordinary: "Ordinaire",
    special: "Spéciale",
    advisory: "Consultatif",
    ordinaryFull: "Résolution ordinaire",
    specialFull: "Résolution spéciale",
    advisoryFull: "Vote consultatif",
    ordinaryDesc: "Requiert >50% des votes exprimés",
    specialDesc: "Requiert ≥66,7% des votes exprimés",
    advisoryDesc: "Vote consultatif non contraignant",
  },
  meeting: {
    annual: "Assemblée générale annuelle",
    special: "Assemblée spéciale",
    writtenConsent: "Consentement écrit",
  },
  footer: {
    tagline:
      "NexTR — Gouvernance On-Chain pour la Vraie Propriété d'Actions Tokenisées",
    poweredBy: "Propulsé par Blockstream AMP & LWK",
    liquidNetwork: "Liquid Network",
  },
  disclaimers: {
    execution:
      "NexTR enregistre les instructions des Hodlers éligibles on-chain. L'exécution est effectuée off-chain par la SPV dépositaire via son courtier/dépositaire, sous la gouvernance du Trust/Trustee, et est soumise aux conditions d'émission et à la disponibilité des prestataires de services.",
    omnibusVsAllocation:
      "Certaines actions sont exécutées comme une instruction omnibus (ex. : votes par procuration), tandis que d'autres événements peuvent être reflétés par Hodler au niveau du token (ex. : paiement en espèces vs choix de réinvestissement).",
    footer:
      "NexTR est un portail de gouvernance informatif pour les Hodlers éligibles d'instruments NexTR. La participation est soumise à l'éligibilité, aux conditions d'émission applicables et à la disponibilité des prestataires de services. Rien sur ce site ne constitue une offre ou une sollicitation.",
  },
  faq: {
    title: "Foire aux questions",
    subtitle:
      "Découvrez comment fonctionne la gouvernance des instructions Hodlers on-chain pour les instruments NexTR sur le Liquid Network.",
    readyToParticipate: "Prêt à participer ?",
    readyDesc:
      "Connectez votre wallet et soumettez des instructions sur les événements actifs.",
    goToDashboard: "Aller au tableau de bord",
    sections: {
      gettingStarted: "Pour commencer",
      governanceWorkflow: "Flux de travail de gouvernance et rôles",
      instructionEventTypes: "Types d'événements d'instruction",
      eventCategories: "Catégories d'événements",
      hodlerSubmitted: "Instructions soumises par les Hodlers",
      quorumAndApproval: "Quorum et seuils d'approbation",
      liquidNetwork: "Liquid Network et technologie",
      onChainDetails: "Ce qui est enregistré on-chain",
      gaidAndWallets: "AMP ID & Wallets",
      securityPrivacy: "Sécurité et confidentialité",
    },
    qs: {
      gettingStarted: {
        "Qu'est-ce que NexTR ?":
          "NexTR est un portail de gouvernance on-chain qui collecte des instructions vérifiables de Hodlers pour les instruments NexTR (titres tokenisés émis par NexBridge). Il enregistre les instructions de Hodlers éligibles sur la blockchain Liquid Network. L'exécution de ces instructions est effectuée off-chain par la SPV dépositaire via son courtier/dépositaire, sous la gouvernance du Trust/Trustee, et sous réserve des conditions d'émission.",
        "Suis-je actionnaire direct d'Apple, Microsoft ou Tesla ?":
          "Non. Les Hodlers d'instruments NexTR ne sont pas des actionnaires directs des sociétés sous-jacentes. La SPV dépositaire est le détenteur du titre légal et le principal de négociation. Lorsque vous soumettez une instruction via NexTR, vous fournissez votre préférence en tant que Hodler éligible d'instruments NexTR. La SPV dépositaire exécute ensuite une instruction omnibus via le courtier/dépositaire conformément aux règles du programme.",
        "Quel wallet ai-je besoin ?":
          'NexTR utilise le wallet Blockstream App avec le type de compte "Managed Assets" (AMP). Les instruments NexTR sont des Transfer Restricted Assets sur le Liquid Network, nécessitant un enregistrement AMP. Vous vous connectez en utilisant votre AMP ID (AMP Account ID), qui identifie de manière unique votre compte enregistré.',
        "WalletConnect fonctionne-t-il avec NexTR ?":
          "Non. Le Liquid Network ne prend actuellement pas en charge WalletConnect. NexTR utilise le AMP ID (AMP Account ID) de votre wallet Blockstream App pour identifier et authentifier votre compte. C'est l'approche standard pour les actifs gérés par AMP sur Liquid.",
        "Avec quels instruments puis-je participer ?":
          "Vous pouvez soumettre des instructions pour tout instrument NexTR que vous détenez, y compris nAAPL (Apple), nMSFT (Microsoft), nTSLA (Tesla), nSPY (S&P 500), nNSDQ (Nasdaq 100) et USTBL (US Treasury Bills). Le poids de votre instruction équivaut au nombre de tokens que vous détenez au snapshot block.",
      },
      governanceWorkflow: {
        "Qu'est-ce que la SPV dépositaire ?":
          "La SPV dépositaire est le détenteur du titre légal et le principal de négociation pour les titres sous-jacents. C'est le titulaire du compte chez le courtier/dépositaire, qui soumet des instructions au nom de tous les Hodlers et reçoit les produits des actions d'entreprise. Elle opère sous la supervision du Trust/Trustee.",
        "Quel rôle joue NexBridge ?":
          "NexBridge est le sponsor du programme et l'émetteur. Il définit les conditions d'émission et les règles du programme, publie les communications aux investisseurs et exploite ce portail dans le cadre de la politique d'exécution. NexBridge ne détient pas directement les titres sous-jacents — c'est la SPV dépositaire.",
        "Quel est le rôle du Trust/Trustee ?":
          "Le Trust/Trustee fournit une propriété isolée en cas de faillite et une supervision de la SPV dépositaire. Il garantit que toutes les actions suivent la documentation du programme et que les intérêts des détenteurs d'instruments sont protégés.",
        "Comment les instructions passent-elles de NexTR à l'exécution ?":
          "Le flux de travail est : (1) Les Hodlers soumettent des instructions on-chain via NexTR, (2) NexTR agrège et enregistre les instructions éligibles, (3) La SPV dépositaire reçoit le résultat agrégé, (4) La SPV dépositaire soumet une instruction omnibus à son courtier/dépositaire, (5) Le courtier/dépositaire exécute l'instruction au niveau de l'émetteur. Pour les choix (ex. espèces vs réinvestissement), les résultats sont reflétés par Hodler au niveau du token.",
      },
      instructionEventTypes: {
        "Qu'est-ce qu'un vote d'instruction ?":
          "Un vote d'instruction est un événement où les Hodlers fournissent leur préférence de gouvernance (ex. Pour, Contre, Abstention sur un élément de vote par procuration). Il utilise l'exécution omnibus : la SPV dépositaire soumet une seule instruction agrégée via le courtier/dépositaire. C'est ainsi que sont traités les votes par procuration, les élections du conseil et les éléments say-on-pay.",
        "Qu'est-ce qu'un choix ?":
          "Un choix est un événement où les Hodlers choisissent entre des options allouables — par exemple, recevoir une distribution en espèces ou la réinvestir. Contrairement aux votes d'instruction, les résultats des choix sont reflétés par Hodler au niveau du token (paiement en espèces vs réinvestissement) conformément aux conditions d'émission.",
        "Qu'est-ce qu'une action d'entreprise non élective ?":
          "Les actions d'entreprise non électives (fractionnements d'actions, fusions, changements de symbole) ne nécessitent pas d'instructions de Hodler. Elles sont automatiquement reflétées dans les droits des tokens via des mises à jour du registre conformément aux conditions d'émission. NexTR affiche ces événements à titre informatif.",
        "Est-ce que je perds mes tokens lorsque je soumets une instruction ?":
          "Non. Soumettre une instruction envoie un montant dust (1 satoshi) de L-BTC comme transaction de signal. Cela est négligeable et sert uniquement à créer un enregistrement vérifiable on-chain. Votre solde de tokens reste effectivement inchangé.",
        "Puis-je modifier mon instruction après l'avoir soumise ?":
          "Non. Une fois qu'une instruction est diffusée sur le Liquid Network, elle est immuable. Cela reflète le vote par procuration traditionnel où les bulletins de vote sont définitifs une fois soumis. Réfléchissez bien à votre choix avant de confirmer.",
        "Puis-je vérifier que mon instruction a été enregistrée ?":
          "Oui. Chaque instruction est une transaction Liquid Network qui peut être vérifiée de manière indépendante à l'aide du Blockstream Explorer. L'ID de transaction est affiché après votre soumission et vous pouvez le consulter à tout moment.",
      },
      eventCategories: {
        "Quels types d'événements NexTR prend-il en charge ?":
          "NexTR prend en charge les mêmes catégories que celles présentes dans la gouvernance institutionnelle traditionnelle : Élections du Conseil d'Administration, Say-on-Pay (rémunération des dirigeants), Ratification de l'auditeur, Fusions et acquisitions, Choix de distribution, Actions sur titres (fractionnements), Amendements aux statuts, Actions sur capital (émission/rachat), Instructions des Hodlers et Changements de gouvernance.",
        "Qu'est-ce qu'une résolution ordinaire ?":
          "Une résolution ordinaire nécessite l'approbation de plus de 50% des instructions exprimées, avec un quorum de 10% (participation minimale). Cela s'applique aux questions courantes comme les élections du conseil et les choix de distribution.",
        "Qu'est-ce qu'une résolution spéciale ?":
          "Une résolution spéciale nécessite l'approbation d'au moins 66,7% (supermajorité des deux tiers) des instructions exprimées, avec un quorum plus élevé de 25%. Cela s'applique aux changements importants comme les fusions, les amendements aux statuts, les actions sur capital et les changements de gouvernance.",
        "Qu'est-ce qu'un vote consultatif ?":
          "Les instructions consultatives sont non contraignantes — le résultat exprime le sentiment des Hodlers mais n'oblige pas légalement le conseil. Say-on-Pay, les ratifications d'auditeur et les instructions soumises par les Hodlers sont généralement consultatifs. Le conseil doit prendre en compte le résultat.",
        "Que signifie la recommandation du Conseil ?":
          'Pour les événements initiés par la direction, le Conseil d\'Administration fournit une recommandation (généralement "POUR"). Cela ressemble aux déclarations de procuration dans la finance traditionnelle. Les instructions soumises par les Hodlers ne comportent généralement pas de recommandation du conseil.',
      },
      hodlerSubmitted: {
        "Puis-je soumettre une instruction si je ne détiens qu'1 token ?":
          "Oui. Contrairement aux marchés traditionnels où la SEC Rule 14a-8 exige entre 2 000 $ et 25 000 $ en participations, NexTR permet à tout Hodler — même avec seulement 1 token — de soumettre une instruction de gouvernance. La gouvernance on-chain élimine les frais administratifs qui justifiaient ces seuils traditionnels élevés.",
        "Quelles sont les exigences pour soumettre une instruction ?":
          "Vous avez besoin de : (1) Au moins 1 token de n'importe quel instrument NexTR, (2) Une période de détention d'au moins 1 440 blocs (~1 jour) avant de soumettre, et (3) Un wallet Blockstream App connecté.",
        "Y a-t-il des limites à la nouvelle soumission d'instructions qui ont échoué ?":
          "Oui. Adapté des règles de nouvelle soumission de la SEC, si une instruction reçoit moins de 5% de soutien à la première tentative, elle ne peut pas être soumise à nouveau pendant 3 ans. Le seuil passe à 15% à la deuxième tentative et à 25% à la troisième. Cela empêche le spam tout en permettant de reconsidérer les idées populaires.",
        "Quelle est la différence entre les instructions de la Direction et celles des Hodlers ?":
          "Les instructions de la Direction sont initiées par le conseil ou la direction de l'entreprise (ex. : élections du conseil, approbations de distribution, fusions-acquisitions). Les instructions des Hodlers sont soumises par des détenteurs de tokens individuels pour mettre des questions à l'ordre du jour. Les instructions de la Direction peuvent comporter une recommandation du conseil ; les instructions des Hodlers sont généralement consultatives.",
      },
      quorumAndApproval: {
        "Qu'est-ce qu'un quorum ?":
          "Le quorum est le pourcentage minimum du poids total des instructions qui doit participer pour qu'un résultat soit valide. Si le quorum n'est pas atteint, l'événement échoue quel que soit le résultat de l'instruction.",
        "Quels sont les seuils de quorum ?":
          "Les résolutions ordinaires nécessitent un quorum de 10%. Les résolutions spéciales nécessitent un quorum de 25%. Les instructions consultatives utilisent également un quorum de 10%, bien qu'étant non contraignantes, le conseil peut toujours prendre en compte le résultat.",
        "Qu'est-ce que la date d'enregistrement ?":
          'La date d\'enregistrement (équivalente au "snapshot block" on-chain) détermine quels Hodlers sont éligibles pour participer et le poids de leur instruction. Seuls les Hodlers à la date d\'enregistrement peuvent soumettre des instructions.',
      },
      liquidNetwork: {
        "Pourquoi NexTR est-il construit sur le Liquid Network ?":
          "Le Liquid Network est une sidechain Bitcoin conçue pour les actifs financiers. Il offre : des temps de bloc de 1 minute (vs 10 min sur Bitcoin), des Transactions Confidentielles qui cachent les montants et types d'actifs aux observateurs tiers, des Transfer Restricted Assets via AMP pour la conformité réglementaire, et les garanties de sécurité d'une sidechain Bitcoin fédérée.",
        "Qu'est-ce que AMP et pourquoi est-ce important ?":
          "AMP (Asset Management Platform) de Blockstream gère les Transfer Restricted Assets sur Liquid. Les instruments NexTR sont gérés par AMP, ce qui signifie que seuls les utilisateurs enregistrés (vérifiés KYC) peuvent les détenir et les transférer. Cela garantit la conformité réglementaire tout en maintenant la transparence on-chain. En production, l'API AMP vérifie le solde de tokens d'un Hodler au snapshot block.",
        "Comment les instructions sont-elles enregistrées on-chain ?":
          "Chaque instruction est une transaction Liquid qui envoie 1 satoshi de L-BTC (pas le token equity) à la propre adresse du Hodler — un auto-envoi. Cela crée une preuve de participation publiquement vérifiable. Le choix d'instruction réel (Pour/Contre/Abstention) est enregistré off-chain avec le backend, lié au txid on-chain. Une amélioration future intégrera un mémo NEXTR_VOTE dans une sortie OP_RETURN pour une auditabilité complète on-chain.",
        "Qu'est-ce qu'un PSET ?":
          "PSET (Partially Signed Elements Transaction) est l'équivalent Liquid du PSBT de Bitcoin. Lorsque vous soumettez une instruction, NexTR construit un PSET contenant la transaction dust L-BTC, qui est signé à l'aide du signataire LWK (Liquid Wallet Kit). Le PSET signé est finalisé et diffusé sur le réseau Liquid via l'API Esplora.",
        "Qu'est-ce que LWK (Liquid Wallet Kit) ?":
          "LWK est une bibliothèque basée sur WASM de Blockstream pour construire des wallets Liquid directement dans le navigateur. NexTR utilise LWK pour créer et gérer des wallets sur Liquid testnet — génération de mnémoniques, dérivation de descripteurs SLIP-77 aveuglés, synchronisation d'UTXOs via Esplora, construction de PSETs, signature et diffusion de transactions. Tout cela s'exécute côté client sans envoyer de clés à un serveur.",
      },
      onChainDetails: {
        "Qu'est-ce exactement que la transaction d'instruction ?":
          "La transaction d'instruction est un simple auto-envoi : votre wallet LWK envoie 1 satoshi de L-BTC à votre propre adresse. C'est tout. Aucun token equity n'est déplacé, aucune métadonnée d'instruction n'est intégrée dans l'implémentation actuelle. La transaction sert d'ancrage immuable de preuve de participation sur la blockchain Liquid.",
        "Quelles données sont visibles sur la blockchain ?":
          "En raison des Transactions Confidentielles de Liquid, très peu est visible. Un observateur externe voit : (1) qu'une transaction a eu lieu entre des adresses, et (2) les frais de transaction. Le montant (1 sat), le type d'actif (L-BTC), et le fait que c'est un auto-envoi sont tous masqués. Aucune participation, aucun choix d'instruction, aucun AMP ID, et aucune information d'événement n'apparaît on-chain.",
        "Qu'est-ce qui n'est PAS on-chain ?":
          "Les données suivantes NE sont PAS enregistrées sur la blockchain : votre choix d'instruction (Pour/Contre/Abstention), l'ID de l'événement, votre AMP ID, votre poids d'instruction, vos participations en tokens (nAAPL, nMSFT, etc.), et le mémo NEXTR_VOTE. Tout cela est géré off-chain par le backend, lié au txid on-chain.",
        "Comment le backend sait-il ce que j'ai instruit ?":
          "Après la diffusion de la transaction dust et l'obtention d'un txid, le wallet appelle un endpoint d'enregistrement du backend avec le txid, l'ID d'événement, l'ID d'option et votre adresse. Le txid est le lien cryptographique entre votre action on-chain et votre enregistrement d'instruction off-chain. Cette approche à deux niveaux maintient les participations privées tout en préservant la vérifiabilité.",
        "Les instructions seront-elles entièrement auditables on-chain à l'avenir ?":
          "Oui. Le code inclut un format de mémo d'instruction (NEXTR_VOTE:<eventId>:<optionId>:<holderAmpId>) conçu pour être intégré dans une sortie OP_RETURN. Une fois que le TxBuilder de LWK prendra en charge OP_RETURN nativement, ce mémo sera ajouté aux transactions d'instruction — rendant les choix auditables on-chain de manière indépendante sans révéler les participations.",
      },
      gaidAndWallets: {
        "Qu'est-ce qu'un AMP ID ?":
          "Un AMP ID (AMP Account ID) est l'identifiant unique de votre compte dans le wallet Blockstream App. C'est une chaîne alphanumérique (10-100 caractères) qui identifie votre compte enregistré AMP. Vous pouvez le trouver dans Blockstream App sous Managed Assets → Recevoir. El AMP ID est le moyen par lequel la plateforme sait quel Hodler enregistré vous êtes.",
        "Quelle est la différence entre le mode AMP ID et le mode LWK ?":
          "Le mode AMP ID se connecte en utilisant l'ID de votre compte Blockstream App — le chemin de production pour les Hodlers vérifiés KYC. Le mode LWK crée un vrai wallet Liquid testnet dans votre navigateur en utilisant Liquid Wallet Kit (WASM) pour tester des transactions on-chain réelles. En production, les deux modes produisent de vraies transactions on-chain.",
        "Le wallet LWK est-il créé par session ou est-il persistant ?":
          "Les deux. Les objets WASM LWK (wallet, signataire, client Esplora) sont créés en mémoire et n'existent que pour la session de navigateur en cours. Cependant, la phrase mnémonique et l'adresse dérivée sont persistées dans le localStorage, de sorte que le wallet peut être automatiquement restauré lorsque vous revenez. Il n'y a pas de base de données côté serveur stockant votre wallet — tout réside dans votre navigateur.",
        "Comment le AMP ID est-il lié au wallet LWK ?":
          "En mode AMP ID, le AMP ID que vous fournissez est utilisé directement comme votre identité, et un wallet de signature LWK est automatiquement provisionné et lié côté serveur. En mode LWK uniquement, les 20 premiers caractères de votre adresse réelle Liquid testnet servent de pseudo-AMP-ID. En production, le AMP ID est l'identité faisant autorité, avec l'API AMP utilisée pour vérifier vos participations au snapshot block.",
        "Mon mnémonique est-il en sécurité dans le localStorage ?":
          "Pour une utilisation sur testnet, le localStorage est acceptable. Pour la production, stocker un mnémonique dans le localStorage est un risque de sécurité — il ne survit pas entre les appareils et est vulnérable aux attaques XSS. L'architecture de production associe les wallets côté serveur à votre AMP ID, chiffrés au repos, ou s'appuie entièrement sur la signature Blockstream App / matériel Jade.",
      },
      securityPrivacy: {
        "Mes participations (nAAPL, nMSFT, etc.) sont-elles visibles lorsque je soumets une instruction ?":
          "Non. Vos participations en tokens ne sont jamais exposées on-chain lorsque vous soumettez une instruction. La transaction ne déplace que 1 sat de L-BTC — aucun token equity n'est touché ou transféré. De plus, les Transactions Confidentielles de Liquid masquent même le montant de L-BTC et le type d'actif aux observateurs tiers. Personne regardant la blockchain ne peut voir quels tokens vous détenez ni combien.",
        "Que peut voir exactement quelqu'un sur la blockchain ?":
          "Un observateur externe ne peut voir qu'une adresse particulière a envoyé une transaction masquée à elle-même. Il ne peut pas voir : (1) le montant (1 sat, masqué par CT), (2) le type d'actif (L-BTC, masqué par CT), (3) votre choix d'instruction (stocké off-chain), (4) vos participations en tokens, ni (5) votre poids d'instruction. La transaction est essentiellement opaque pour les tiers.",
        "Mon choix d'instruction (Pour/Contre) est-il privé ?":
          "Actuellement, oui — votre choix d'instruction est enregistré off-chain avec le backend et lié à votre txid on-chain. Il n'est pas intégré dans la transaction elle-même. Dans une future version de production, un mémo OP_RETURN pourra être ajouté pour une auditabilité complète, ce qui rendrait le choix lisible publiquement. Cependant, même alors, vos participations et votre poids d'instruction resteraient privés.",
        "Les instructions peuvent-elles être manipulées ?":
          "L'intégrité des instructions est protégée par de multiples mécanismes : (1) Le poids basé sur le snapshot empêche l'achat de tokens après la création de l'événement, (2) Une instruction par Hodler empêche les doublons, (3) L'immuabilité de la blockchain Liquid empêche l'altération des transactions, (4) Chaque instruction est ancrée à un txid vérifiable on-chain, et (5) L'enregistrement AMP garantit que seuls les Hodlers vérifiés KYC participent.",
        "Que se passe-t-il si la plateforme tombe en panne pendant une fenêtre d'instruction ?":
          "Les instructions déjà soumises sont enregistrées de manière permanente sur la blockchain Liquid quel que soit l'état de la plateforme. La fenêtre d'instruction est mesurée en blocs, pas en temps réel, donc une panne temporaire de la plateforme n'affecte pas la fenêtre. Le txid on-chain sert de preuve immuable de votre participation.",
      },
    },
  },
  categories: {
    board_election: "Élection du Conseil d'Administration",
    say_on_pay: "Say-on-Pay (rémunération des dirigeants)",
    auditor_ratification: "Ratification de l'auditeur",
    merger_acquisition: "Fusion ou acquisition",
    dividend_distribution: "Choix de distribution",
    stock_action: "Action sur titres (fractionnement / fractionnement inversé)",
    bylaw_amendment: "Amendement des statuts / de la charte",
    capital_action: "Action sur capital (émission / rachat)",
    shareholder_proposal: "Instruction générale des Hodlers",
    shareholder_esg: "ESG / Durabilité",
    shareholder_exec_comp: "Limites de rémunération des dirigeants",
    shareholder_governance: "Réforme de la gouvernance",
    shareholder_transparency: "Transparence / Divulgation",
    shareholder_rights: "Droits des Hodlers",
    governance: "Changement de gouvernance",
    other: "Autre",
    community_new_underlying: "Demander un Nouveau Sous-jacent",
    community_listing_venue: "Demander un Lieu de Cotation",
    community_bespoke_product: "Demander un Produit Sur Mesure",
    community_program_features: "Demander des Fonctionnalités",
    community_market_structure: "Changements de Structure de Marché",
    community_transparency: "Documentation & Transparence",
    community_other: "Autre Proposition Communautaire",
  },
  categoryDescs: {
    board_election: "Élire ou réélire les membres du Conseil d'Administration",
    say_on_pay: "Instruction consultative sur les packages de rémunération des dirigeants",
    auditor_ratification:
      "Ratifier la nomination de l'auditeur externe / cabinet comptable",
    merger_acquisition:
      "Instruction sur une fusion, acquisition ou combinaison d'entreprises proposée",
    dividend_distribution:
      "Choisir le mode de paiement des dividendes ou la préférence de distribution (ex. espèces vs réinvestissement)",
    stock_action:
      "Action d'entreprise non élective — droits des tokens mis à jour via le registre",
    bylaw_amendment:
      "Instruction sur les amendements à la charte d'entreprise, aux statuts ou aux statuts constitutifs",
    capital_action:
      "Instruction sur une nouvelle émission d'actions, un programme de rachat ou une offre d'actions",
    shareholder_proposal:
      "Instruction générale pour l'ordre du jour de gouvernance (consultative, non contraignante)",
    shareholder_esg:
      "Demande de politique environnementale, sociale ou de gouvernance (ex. divulgation climatique, DEI)",
    shareholder_exec_comp:
      "Demander des limites sur la rémunération des dirigeants, des politiques de récupération ou la divulgation du ratio de rémunération",
    shareholder_governance:
      "Demander des changements de gouvernance comme l'accès par procuration, un président indépendant ou un vote à la majorité",
    shareholder_transparency:
      "Demander une divulgation supplémentaire sur le lobbying, les dépenses politiques ou la chaîne d'approvisionnement",
    shareholder_rights:
      "Proposer des droits de réunion spéciale, un consentement écrit ou l'abrogation des mesures anti-OPA",
    governance:
      "Changements au cadre de gouvernance, aux règles d'instruction ou aux seuils de quorum",
    other: "Toute autre question pour examen par les Hodlers",
    community_new_underlying: "Proposer un nouvel actif sous-jacent pour la tokenisation NexBridge (ex. 'Je veux une exposition à [actif]')",
    community_listing_venue: "Demander une cotation sur un nouvel exchange, banque, courtier ou intégration de plateforme",
    community_bespoke_product: "Demander un instrument personnalisé avec des paramètres spécifiques (panier, couvert, rendement, limites)",
    community_program_features: "Suggérer des fonctionnalités du portail, rapports, notifications, UX des actions corporatives ou APIs",
    community_market_structure: "Proposer des changements dans la structure de marché, les règles de négociation ou les processus de règlement",
    community_transparency: "Demander plus de divulgations, format de preuve de réserves, cadence d'audit ou clarté des termes",
    community_other: "Tout autre commentaire ou suggestion de la communauté pour la plateforme",
  },
};
