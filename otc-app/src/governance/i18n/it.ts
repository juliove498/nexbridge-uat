import type { Translations } from "./types";

export const it: Translations = {
  nav: {
    governance: "Governance Azioni",
    community: "NexVoice",
    submitInstruction: "Invia Istruzione",
    faq: "FAQ",
  },
  common: {
    backToDashboard: "Torna al Dashboard",
    launchApp: "Avvia App",
    submitInstruction: "Invia Istruzione",
    connectWallet: "Connetti Wallet",
    cancel: "Annulla",
    all: "Tutti",
    active: "Attivi",
    closed: "Chiusi",
    filter: "Filtra:",
    allInstruments: "Tutti gli Strumenti",
    votes: "voti",
    votingPower: "potere di voto",
    quorum: "quorum",
    quorumReached: "Quorum raggiunto",
    quorumPending: "Quorum in attesa",
    quorumNotReached: "Quorum non raggiunto",
    participation: "Partecipazione",
    totalVotes: "voti totali",
    winner: "Vincitore",
    hodler: "Hodler",
    management: "Management",
    instruction: "Istruzione",
    nonBinding: "Non vincolante",
    passed: "Approvata",
    rejected: "Respinta",
    approvedAdvisory: "Approvata (Consultiva)",
    liveOnLiquid: "Live su Liquid Network",
    ended: "Terminato",
    left: "rimanenti",
  },
  home: {
    title: "Istruzioni On-Chain degli Hodler per",
    titleHighlight: "Azioni Societarie",
    subtitle:
      "NexTR replica gli avvisi dei custodi, raccoglie le istruzioni degli hodler idonei on-chain e riflette i risultati tramite un depositary e una struttura di custodia regolamentati.",
    oneLiner:
      "Le azioni omnibus seguono le regole del programma (es. maggioranza); le elezioni allocabili possono essere applicate per hodler a livello di token.",
    featuresTitle: "Basato sulla Sicurezza di Bitcoin",
    featuresSubtitle:
      "NexTR sfrutta la sidechain federata Liquid Network per una governance delle istruzioni degli hodler di livello istituzionale.",
    howItWorksTitle: "Come Funziona",
    howItWorksSubtitle:
      "Un processo semplice e trasparente dalla connessione del wallet alla verifica on-chain delle istruzioni.",
    features: {
      verifiable: {
        title: "Verificabile On-Chain",
        description:
          "Ogni istruzione degli hodler è registrata come transazione Liquid Network con prova crittografica, verificabile da chiunque.",
      },
      confidential: {
        title: "Transazioni Confidenziali",
        description:
          "Le transazioni confidenziali di Liquid proteggono i saldi degli hodler mantenendo la verificabilità delle istruzioni.",
      },
      finality: {
        title: "Finalità in 2 Minuti",
        description:
          "Le istruzioni si regolano in meno di 2 minuti con i tempi di blocco di 1 minuto di Liquid e la finalità a 2 conferme.",
      },
      amp: {
        title: "Asset Protetti da AMP",
        description:
          "Gli strumenti NexTR sono Transfer Restricted Assets gestiti tramite Blockstream AMP con piena conformità KYC.",
      },
    },
    stats: {
      activeEvents: "Eventi Attivi",
      instructionsRecorded: "Istruzioni Registrate",
      instrumentsSupported: "Strumenti Supportati",
      liquidBlockHeight: "Altezza Blocco Liquid",
    },
    steps: {
      s1: {
        title: "Connetti Wallet",
        desc: "Collega il tuo wallet Blockstream App utilizzando il tuo AMP ID Managed Assets. I saldi dei tuoi token determinano il peso delle tue istruzioni.",
      },
      s2: {
        title: "Rivedi Eventi",
        desc: "Esplora gli eventi di istruzione attivi per le tue partecipazioni in strumenti NexTR. Ogni evento dettaglia l'azione societaria e le opzioni disponibili.",
      },
      s3: {
        title: "Invia Istruzione",
        desc: "Seleziona la tua scelta e firma una transazione Liquid. Viene inviato un dust amount come segnale — mantieni tutti i tuoi token.",
      },
      s4: {
        title: "Verifica On-Chain",
        desc: "La tua istruzione viene registrata come transazione Liquid Network con un memo OP_RETURN. Chiunque può verificare i risultati.",
      },
    },
  },
  dashboard: {
    title: "Governance",
    subtitle:
      "Invia istruzioni sugli eventi di azioni societarie per gli strumenti NexTR",
    activeEvents: "Eventi Attivi",
    completed: "Completati",
    supportedInstruments: "Strumenti Supportati",
    yourHoldings: "Le Tue Partecipazioni",
    holdingsTitle: "Le Tue Partecipazioni in Strumenti NexTR",
    noEventsFound: "Nessun evento trovato",
  },
  vote: {
    submitYourInstruction: "Invia la Tua Istruzione",
    instructionWeight: "Peso dell'istruzione:",
    submitOnChain: "Invia Istruzione On-Chain",
    connectWalletTitle: "Connetti il Tuo Wallet",
    connectWalletDesc:
      "Connetti il tuo wallet Blockstream App per inviare la tua istruzione. Il peso della tua istruzione è determinato dal tuo",
    instructionRecorded: "Istruzione Registrata",
    instructionBroadcast: "Istruzione Trasmessa On-Chain",
    youSelected: "Hai selezionato",
    withWeight: "con",
    confirmTitle: "Conferma la Tua Istruzione",
    confirmDescMock:
      "Questo registrerà la tua istruzione come transazione Liquid Network.",
    confirmDescLwk:
      "Questo trasmetterà una transazione reale su Liquid testnet.",
    event: "Evento",
    yourInstruction: "La tua istruzione",
    network: "Network",
    fee: "Commissione",
    signBroadcast: "Firma & Trasmetti",
    signSubmit: "Firma & Invia",
    broadcasting: "Trasmissione in corso...",
    signing: "Firma in corso...",
    securityLwk:
      "La tua istruzione verrà trasmessa come transazione reale su Liquid testnet. Viene utilizzato un invio dust di 1 sat L-BTC come segnale di istruzione. La transazione è firmata nel browser tramite LWK WASM — le tue chiavi non lasciano mai il browser.",
    securityMock:
      "La tua istruzione verrà registrata come transazione Liquid Network con un memo OP_RETURN. Ti verrà richiesto di firmare la transazione con il tuo wallet. Viene inviato un dust amount di {asset} come segnale di istruzione — non perdi i tuoi token.",
    viewOnExplorer: "Visualizza su Blockstream Explorer",
    instructionFailed: "Istruzione fallita",
  },
  results: {
    finalResults: "Risultati Finali",
    instructionBreakdown: "Dettaglio Istruzioni",
    participationAndQuorum: "Partecipazione & Quorum",
    eventDetails: "Dettagli Evento",
    option: "Opzione",
    power: "Potere",
    verifyAll: "Verifica Tutte le Istruzioni su Blockstream Explorer",
    category: "Categoria",
    resolutionType: "Tipo di Delibera",
    meetingType: "Tipo di Assemblea",
    recordDate: "Data di Registrazione",
    instructionWindow: "Finestra di istruzione",
    snapshotBlock: "Snapshot block",
    totalParticipants: "Partecipanti totali",
    totalInstructionWeight: "Peso totale istruzioni",
    approvalThreshold: "Soglia di approvazione",
    advisoryNonBinding: "Consultiva (non vincolante)",
  },
  create: {
    title: "Invia Istruzione",
    subtitle: "Invia un'istruzione di governance per gli hodler di strumenti NexTR",
    walletRequired: "Wallet Richiesto",
    walletRequiredDesc:
      "Connetti il tuo wallet Blockstream App per inviare istruzioni di governance per strumenti NexTR.",
    anyHodlerTitle: "Qualsiasi hodler può inviare un'istruzione",
    anyHodlerDesc:
      "A differenza dei mercati tradizionali che richiedono $2.000+ in partecipazioni (SEC Rule 14a-8), NexTR consente a qualsiasi hodler — anche con 1 token — di inviare istruzioni di governance. La registrazione on-chain delle istruzioni elimina i costi amministrativi che giustificavano soglie elevate.",
    categoryTitle: "Categoria Istruzione",
    categoryDesc:
      "Seleziona il tipo di istruzione hodler. Le azioni riservate al management (elezioni del consiglio, M&A, dividendi) sono create dall'emittente.",
    categoryDescCommunity: "Seleziona l'argomento per la tua consultazione comunitaria. Tutte le proposte comunitarie sono consultive e non vincolanti — aiutano NexBridge a valutare l'interesse e a dare priorità.",
    categoryLabel: "Categoria",
    selectCategory: "Seleziona categoria istruzione",
    resolutionType: "Tipo di Delibera",
    proposerType: "Tipo Proponente",
    proposerDesc:
      "Inviato da te come hodler di token. Le istruzioni del management sono create dall'emittente.",
    proposerDescCommunity: "Inviata da qualsiasi detentore di strumenti NexTR come consultazione comunitaria non vincolante.",
    detailsTitle: "Dettagli Istruzione",
    detailsDesc: "Descrivi l'azione societaria o la decisione di governance",
    titleLabel: "Titolo",
    titlePlaceholder:
      "es. Distribuzione Dividendo Annuale per Hodler nAAPL",
    summaryLabel: "Riepilogo",
    summaryPlaceholder: "Un breve riepilogo per l'elenco delle proposte",
    fullDescLabel: "Descrizione Completa",
    fullDescPlaceholder:
      "Fornisci tutti i dettagli sulla proposta, inclusi motivazioni, impatto e piano di implementazione...",
    characters: "caratteri",
    configuration: "Configurazione",
    configurationDesc: "Imposta i parametri di istruzione per questo evento",
    targetAsset: "Asset Target",
    selectAsset: "Seleziona asset",
    quorumRequired: "Quorum Richiesto (%)",
    autoSetNote: "(impostato automaticamente per tipo di delibera)",
    instructionWindow: "Finestra di Istruzione",
    day: "giorno",
    days: "giorni",
    optionsTitle: "Opzioni Istruzione",
    optionsDesc:
      "Definisci le scelte che gli hodler possono selezionare (minimo 2, massimo 10)",
    optionLabel: "Etichetta opzione",
    optionDescPlaceholder: "Descrizione (facoltativa)",
    addOption: "Aggiungi Opzione",
    submitNote:
      "L'invio di un'istruzione richiede una transazione Liquid Network. Ti verrà richiesto di firmare con il tuo wallet.",
    submitting: "Invio in corso...",
  },
  community: {
    title: "NexBridge Voice",
    subtitle: "Consultazioni comunitarie non vincolanti per la piattaforma e il programma NexBridge",
    votingWeightExplainer: "Il tuo peso di voto è determinato dal valore totale in dollari di tutti gli strumenti NexTR che possiedi. Le proposte comunitarie sono consultive e non vincolanti — segnalano l'interesse della comunità ma non obbligano ad alcuna azione.",
    totalPortfolioValue: "Valore Totale del Portafoglio",
    communityProposer: "Community",
    noProposalsFound: "Nessuna proposta della community trovata",
    submitCommunityProposal: "Invia Proposta della Community",
    allCategories: "Tutte le Categorie",
    advisoryDisclaimer: "Le proposte comunitarie sono consultazioni non vincolanti che misurano il sentiment della comunità — simile a una verifica di temperatura. I risultati segnalano interesse e aiutano NexBridge a dare priorità, ma non obbligano né impongono alcuna azione. Tutte le proposte comunitarie sono consultive per impostazione predefinita.",
    advisoryDisclaimerShort: "Consultivo · Non vincolante",
  },
  voteDetail: {
    time: "Tempo",
    snapshot: "Snapshot",
    approval: "Approvazione",
    advisory: "Consultivo",
    proposedBy: "Proposto da",
    currentResults: "Risultati Attuali",
    timeline: "Timeline",
    created: "Creato",
    windowOpened: "Finestra di istruzione aperta",
    windowCloses: "Finestra di istruzione chiusa",
    blockRange: "Block range",
    instructionVerification: "Verifica Istruzione",
    verificationDesc:
      "Tutte le istruzioni sono registrate sulla blockchain Liquid Network e possono essere verificate in modo indipendente utilizzando qualsiasi block explorer Liquid.",
    verifyOnExplorer: "Verifica su Blockstream Explorer",
    boardRecommends: "Il Consiglio di Amministrazione raccomanda",
    windowClosed: "Finestra di istruzione chiusa",
    remaining: "rimanenti",
    advisoryNote:
      "Il risultato è non vincolante ma il Consiglio considera il sentiment degli hodler nelle sue decisioni.",
    quorumNote:
      "Un quorum del {quorum}% del peso totale delle istruzioni deve partecipare affinché il risultato sia valido.",
  },
  status: {
    draft: "Bozza",
    active: "Attivo",
    closed: "Chiuso",
    executed: "Eseguito",
    cancelled: "Annullato",
  },
  resolution: {
    ordinary: "Ordinaria",
    special: "Speciale",
    advisory: "Consultiva",
    ordinaryFull: "Delibera Ordinaria",
    specialFull: "Delibera Speciale",
    advisoryFull: "Voto Consultivo",
    ordinaryDesc: "Richiede >50% dei voti espressi",
    specialDesc: "Richiede ≥66.7% dei voti espressi",
    advisoryDesc: "Voto consultivo non vincolante",
  },
  meeting: {
    annual: "Assemblea Generale Annuale",
    special: "Assemblea Straordinaria",
    writtenConsent: "Consenso Scritto",
  },
  footer: {
    tagline:
      "NexTR — Governance On-Chain per la Vera Proprietà di Azioni Tokenizzate",
    poweredBy: "Powered by Blockstream AMP & LWK",
    liquidNetwork: "Liquid Network",
  },
  disclaimers: {
    execution:
      "NexTR registra le istruzioni degli hodler idonei on-chain. L'esecuzione è effettuata off-chain dal Depositary SPV tramite il suo broker/custode, sotto la governance del Trust/Trustee, ed è soggetta ai Termini di Emissione e alla disponibilità dei fornitori di servizi.",
    omnibusVsAllocation:
      "Alcune azioni sono eseguite come istruzione omnibus (es. voti per delega), mentre altri eventi possono essere riflessi per hodler a livello di token (es. elezioni di pagamento in contanti vs reinvestimento).",
    footer:
      "NexTR è un portale di governance informativo per gli hodler idonei di strumenti NexTR. La partecipazione è soggetta a idoneità, ai Termini di Emissione applicabili e alla disponibilità dei fornitori di servizi. Nulla su questo sito costituisce un'offerta o una sollecitazione.",
  },
  faq: {
    title: "Domande Frequenti",
    subtitle:
      "Scopri come funziona la governance delle istruzioni degli hodler on-chain per gli strumenti NexTR su Liquid Network.",
    readyToParticipate: "Pronto a partecipare?",
    readyDesc:
      "Connetti il tuo wallet e invia istruzioni sugli eventi attivi.",
    goToDashboard: "Vai al Dashboard",
    sections: {
      gettingStarted: "Per Iniziare",
      governanceWorkflow: "Flusso di Governance & Ruoli",
      instructionEventTypes: "Tipi di Eventi di Istruzione",
      eventCategories: "Categorie di Eventi",
      hodlerSubmitted: "Istruzioni Inviate dagli Hodler",
      quorumAndApproval: "Quorum & Soglie di Approvazione",
      liquidNetwork: "Liquid Network & Tecnologia",
      onChainDetails: "Cosa Viene Registrato On-Chain",
      gaidAndWallets: "AMP ID & Wallet",
      securityPrivacy: "Sicurezza & Privacy",
    },
    qs: {
      gettingStarted: {
        "Cos'è NexTR?":
          "NexTR è un portale di governance on-chain che raccoglie istruzioni verificabili degli hodler per gli strumenti NexTR (azioni tokenizzate emesse da NexBridge). Registra le istruzioni degli hodler idonei sulla blockchain Liquid Network. L'esecuzione di tali istruzioni è effettuata off-chain dal Depositary SPV tramite il suo broker/custode, sotto la governance del Trust/Trustee e soggetta ai Termini di Emissione.",
        "Sono un azionista diretto di Apple, Microsoft o Tesla?":
          "No. Gli hodler di strumenti NexTR non sono azionisti diretti delle società sottostanti. Il Depositary SPV è il titolare legale e il principale commerciale. Quando invii un'istruzione tramite NexTR, stai fornendo la tua preferenza come hodler idoneo di strumenti NexTR. Il Depositary SPV esegue quindi un'istruzione omnibus tramite il broker/custode in linea con le regole del programma.",
        "Quale wallet mi serve?":
          'NexTR utilizza il wallet Blockstream App con il tipo di account "Managed Assets" (AMP). Gli strumenti NexTR sono Transfer Restricted Assets su Liquid Network, che richiedono la registrazione AMP. Ti connetti utilizzando il tuo AMP ID (AMP Account ID), che identifica in modo univoco il tuo account registrato.',
        "WalletConnect funziona con NexTR?":
          "No. Liquid Network attualmente non supporta WalletConnect. NexTR utilizza il AMP ID (AMP Account ID) dal tuo wallet Blockstream App per identificare e autenticare il tuo account. Questo è l'approccio standard per gli asset gestiti da AMP su Liquid.",
        "Con quali strumenti posso partecipare?":
          "Puoi inviare istruzioni per qualsiasi strumento NexTR che possiedi, inclusi nAAPL (Apple), nMSFT (Microsoft), nTSLA (Tesla), nSPY (S&P 500), nNSDQ (Nasdaq 100) e USTBL (US Treasury Bills). Il peso della tua istruzione equivale al numero di token che possiedi al snapshot block.",
      },
      governanceWorkflow: {
        "Cos'è il Depositary SPV?":
          "Il Depositary SPV è il titolare legale e il principale commerciale per i titoli sottostanti. È il titolare del conto presso il broker/custode, invia istruzioni per conto di tutti gli hodler e riceve i proventi delle azioni societarie. Opera sotto la supervisione del Trust/Trustee.",
        "Qual è il ruolo di NexBridge?":
          "NexBridge è lo Sponsor del Programma e l'Emittente. Definisce i Termini di Emissione e le regole del programma, pubblica le comunicazioni agli investitori e gestisce questo portale secondo la politica di esecuzione. NexBridge non detiene direttamente i titoli sottostanti — questo è il Depositary SPV.",
        "Qual è il ruolo del Trust/Trustee?":
          "Il Trust/Trustee fornisce proprietà bankruptcy-remote e supervisione del Depositary SPV. Garantisce che tutte le azioni seguano la documentazione del programma e che gli interessi degli hodler di strumenti siano protetti.",
        "Come fluiscono le istruzioni da NexTR all'esecuzione?":
          "Il flusso è: (1) Gli hodler inviano istruzioni on-chain tramite NexTR, (2) NexTR aggrega e registra le istruzioni idonee, (3) Il Depositary SPV riceve il risultato aggregato, (4) Il Depositary SPV invia un'istruzione omnibus al suo broker/custode, (5) Il broker/custode esegue l'istruzione a livello di emittente. Per le elezioni (es. contanti vs reinvestimento), i risultati sono riflessi per hodler a livello di token.",
      },
      instructionEventTypes: {
        "Cos'è un Voto di Istruzione?":
          "Un Voto di Istruzione è un evento in cui gli hodler forniscono la loro preferenza di governance (es. Favorevole, Contrario, Astenuto su un elemento di voto per delega). Utilizza l'esecuzione omnibus: il Depositary SPV invia un'unica istruzione aggregata tramite il broker/custode. Questo è il modo in cui vengono gestiti i voti per delega, le elezioni del consiglio e gli elementi say-on-pay.",
        "Cos'è un'Elezione?":
          "Un'Elezione è un evento in cui gli hodler scelgono tra opzioni allocabili — ad esempio, ricevere una distribuzione in contanti o reinvestirla. A differenza dei voti di istruzione, i risultati delle elezioni sono riflessi per hodler a livello di token (pagamento in contanti vs reinvestimento) secondo i Termini di Emissione.",
        "Cos'è un'Azione Societaria Non Elettiva?":
          "Le azioni societarie non elettive (frazionamenti azionari, fusioni, cambi di simbolo) non richiedono istruzioni degli hodler. Vengono automaticamente riflesse nei diritti dei token tramite aggiornamenti del registro in conformità con i Termini di Emissione. NexTR visualizza questi come eventi informativi.",
        "Perdo i miei token quando invio un'istruzione?":
          "No. L'invio di un'istruzione invia un dust amount (1 satoshi) di L-BTC come transazione di segnale. Questo è trascurabile e serve solo a creare un record on-chain verificabile. Il saldo dei tuoi token rimane sostanzialmente invariato.",
        "Posso cambiare la mia istruzione dopo l'invio?":
          "No. Una volta che un'istruzione viene trasmessa su Liquid Network, è immutabile. Questo rispecchia il voto per delega tradizionale dove le schede sono definitive una volta inviate. Considera attentamente la tua scelta prima di confermare.",
        "Posso verificare che la mia istruzione sia stata registrata?":
          "Sì. Ogni istruzione è una transazione Liquid Network che può essere verificata in modo indipendente utilizzando Blockstream Explorer. L'ID della transazione viene mostrato dopo l'invio e puoi consultarlo in qualsiasi momento.",
      },
      eventCategories: {
        "Quali tipi di eventi supporta NexTR?":
          "NexTR supporta le stesse categorie presenti nella governance istituzionale tradizionale: Elezioni del Consiglio di Amministrazione, Say-on-Pay (compensazione esecutiva), Ratifica del Revisore, Fusioni e Acquisizioni, Elezioni di Distribuzione, Azioni Azionarie (frazionamenti), Modifiche allo Statuto, Azioni di Capitale (emissione/riacquisto), Istruzioni degli Hodler e Modifiche di Governance.",
        "Cos'è una Delibera Ordinaria?":
          "Una delibera ordinaria richiede l'approvazione di oltre il 50% delle istruzioni espresse, con un quorum del 10% (partecipazione minima). Questo si applica a questioni di routine come elezioni del consiglio ed elezioni di distribuzione.",
        "Cos'è una Delibera Speciale?":
          "Una delibera speciale richiede l'approvazione di almeno il 66,7% (maggioranza qualificata di due terzi) delle istruzioni espresse, con un quorum più elevato del 25%. Questo si applica a modifiche significative come fusioni, modifiche allo statuto, azioni di capitale e modifiche di governance.",
        "Cos'è un Voto Consultivo?":
          "Le istruzioni consultive sono non vincolanti — il risultato esprime il sentiment degli hodler ma non vincola legalmente il consiglio. Say-on-Pay, ratifiche dei revisori e istruzioni inviate dagli hodler sono tipicamente consultive. Il consiglio è tenuto a considerare il risultato.",
        "Cosa significa la Raccomandazione del Consiglio?":
          'Per gli eventi avviati dal management, il Consiglio di Amministrazione fornisce una raccomandazione (di solito "FAVOREVOLE"). Questo è simile alle dichiarazioni di delega nella finanza tradizionale. Le istruzioni inviate dagli hodler in genere non hanno una raccomandazione del consiglio.',
      },
      hodlerSubmitted: {
        "Posso inviare un'istruzione se possiedo solo 1 token?":
          "Sì. A differenza dei mercati tradizionali dove la SEC Rule 14a-8 richiede da $2.000 a $25.000 in partecipazioni, NexTR consente a qualsiasi hodler — anche con solo 1 token — di inviare un'istruzione di governance. La governance on-chain elimina il sovraccarico amministrativo che giustificava quelle soglie tradizionali elevate.",
        "Quali sono i requisiti per inviare un'istruzione?":
          "Hai bisogno di: (1) Almeno 1 token di qualsiasi strumento NexTR, (2) Un periodo di detenzione di almeno 1.440 blocchi (~1 giorno) prima dell'invio, e (3) Un wallet Blockstream App connesso.",
        "Ci sono limiti al reinvio di istruzioni fallite?":
          "Sì. Adattato dalle regole di reinvio della SEC, se un'istruzione riceve meno del 5% di supporto al primo tentativo, non può essere reinviata per 3 anni. La soglia sale al 15% al secondo tentativo e al 25% al terzo. Questo previene lo spam consentendo la riconsiderazione di idee popolari.",
        "Qual è la differenza tra istruzioni del Management e degli Hodler?":
          "Le istruzioni del Management sono avviate dal consiglio o dalla leadership aziendale (es. elezioni del consiglio, approvazioni di distribuzione, M&A). Le istruzioni degli Hodler sono inviate da singoli hodler di token per mettere questioni all'ordine del giorno. Le istruzioni del Management possono avere una raccomandazione del consiglio; le istruzioni degli hodler sono tipicamente consultive.",
      },
      quorumAndApproval: {
        "Cos'è un quorum?":
          "Il quorum è la percentuale minima del peso totale delle istruzioni che deve partecipare affinché un risultato sia valido. Se il quorum non viene raggiunto, l'evento fallisce indipendentemente dal risultato dell'istruzione.",
        "Quali sono le soglie di quorum?":
          "Le delibere ordinarie richiedono un quorum del 10%. Le delibere speciali richiedono un quorum del 25%. Le istruzioni consultive utilizzano anche il quorum del 10%, sebbene come non vincolanti il consiglio possa comunque considerare il risultato.",
        "Cos'è la Data di Registrazione?":
          'La Data di Registrazione (equivalente allo "snapshot block" on-chain) determina quali hodler sono idonei a partecipare e il loro peso di istruzione. Solo gli hodler alla Data di Registrazione possono inviare istruzioni.',
      },
      liquidNetwork: {
        "Perché NexTR è costruito su Liquid Network?":
          "Liquid Network è una sidechain Bitcoin progettata per asset finanziari. Offre: tempi di blocco di 1 minuto (vs 10 min su Bitcoin), Transazioni Confidenziali che nascondono importi e tipi di asset da osservatori terzi, Transfer Restricted Assets tramite AMP per la conformità normativa, e le garanzie di sicurezza di una sidechain Bitcoin federata.",
        "Cos'è AMP e perché è importante?":
          "AMP (Asset Management Platform) di Blockstream gestisce i Transfer Restricted Assets su Liquid. Gli strumenti NexTR sono gestiti da AMP, il che significa che solo gli utenti registrati (verificati KYC) possono detenerli e trasferirli. Questo garantisce la conformità normativa mantenendo la trasparenza on-chain. In produzione, l'API AMP verifica il saldo dei token di un hodler allo snapshot block.",
        "Come vengono registrate le istruzioni on-chain?":
          "Ogni istruzione è una transazione Liquid che invia 1 satoshi di L-BTC (non il token equity) al proprio indirizzo dell'hodler — un auto-invio. Questo crea una prova di partecipazione pubblicamente verificabile. La scelta di istruzione effettiva (Favorevole/Contrario/Astenuto) viene registrata off-chain con il backend, collegata al txid on-chain. Un miglioramento futuro includerà un memo NEXTR_VOTE in un output OP_RETURN per una completa verificabilità on-chain.",
        "Cos'è un PSET?":
          "PSET (Partially Signed Elements Transaction) è l'equivalente su Liquid del PSBT di Bitcoin. Quando invii un'istruzione, NexTR costruisce un PSET contenente la transazione dust L-BTC, che viene firmata utilizzando il firmatario LWK (Liquid Wallet Kit). Il PSET firmato viene finalizzato e trasmesso alla rete Liquid tramite l'API Esplora.",
        "Cos'è LWK (Liquid Wallet Kit)?":
          "LWK è una libreria basata su WASM di Blockstream per costruire wallet Liquid direttamente nel browser. NexTR usa LWK per creare e gestire wallet su Liquid testnet — generazione di mnemonici, derivazione di descrittori SLIP-77 offuscati, sincronizzazione UTXO tramite Esplora, costruzione di PSET, firma e trasmissione di transazioni. Tutto questo viene eseguito lato client senza inviare chiavi a un server.",
      },
      onChainDetails: {
        "Cos'è esattamente la transazione di istruzione?":
          "La transazione di istruzione è un semplice auto-invio: il tuo wallet LWK invia 1 satoshi di L-BTC al tuo stesso indirizzo. Tutto qui. Nessun token equity viene spostato, nessun metadato di istruzione viene incluso nell'implementazione attuale. La transazione serve come ancora immutabile di prova di partecipazione sulla blockchain Liquid.",
        "Quali dati sono visibili sulla blockchain?":
          "A causa delle Transazioni Confidenziali di Liquid, molto poco è visibile. Un osservatore esterno vede: (1) che è avvenuta una transazione tra indirizzi, e (2) la commissione della transazione. L'importo (1 sat), il tipo di asset (L-BTC), e il fatto che è un auto-invio sono tutti offuscati. Nessun possesso, nessuna scelta di istruzione, nessun AMP ID e nessuna informazione sull'evento appare on-chain.",
        "Cosa NON è on-chain?":
          "I seguenti dati NON sono registrati sulla blockchain: la tua scelta di istruzione (Favorevole/Contrario/Astenuto), l'ID dell'evento, il tuo AMP ID, il tuo peso di istruzione, i tuoi possessi di token (nAAPL, nMSFT, ecc.), e il memo NEXTR_VOTE. Tutto questo è gestito off-chain dal backend, collegato al txid on-chain.",
        "Come fa il backend a sapere cosa ho istruito?":
          "Dopo che la transazione dust viene trasmessa e si ottiene un txid, il wallet chiama un endpoint di registrazione del backend con il txid, l'ID evento, l'ID opzione e il tuo indirizzo. Il txid è il collegamento crittografico tra la tua azione on-chain e il tuo record di istruzione off-chain. Questo approccio a due livelli mantiene i possessi privati preservando la verificabilità.",
        "Le istruzioni saranno completamente verificabili on-chain in futuro?":
          "Sì. Il codice include un formato di memo istruzione (NEXTR_VOTE:<eventId>:<optionId>:<holderAmpId>) progettato per essere incluso in un output OP_RETURN. Una volta che il TxBuilder di LWK supporterà OP_RETURN nativamente, questo memo verrà aggiunto alle transazioni di istruzione — rendendo le scelte verificabili on-chain in modo indipendente senza rivelare i possessi.",
      },
      gaidAndWallets: {
        "Cos'è un AMP ID?":
          "Un AMP ID (AMP Account ID) è l'identificatore univoco del tuo account nel wallet Blockstream App. È una stringa alfanumerica (10-100 caratteri) che identifica il tuo account registrato AMP. Puoi trovarlo in Blockstream App sotto Managed Assets → Ricevi. Il AMP ID è il modo in cui la piattaforma sa quale hodler registrato sei.",
        "Qual è la differenza tra modalità AMP ID e modalità LWK?":
          "La modalità AMP ID si connette usando l'ID del tuo account Blockstream App — il percorso di produzione per hodler verificati KYC. La modalità LWK crea un vero wallet Liquid testnet nel tuo browser usando Liquid Wallet Kit (WASM) per testare transazioni on-chain reali. In produzione, entrambe le modalità producono transazioni on-chain reali.",
        "Il wallet LWK viene creato per sessione o è persistente?":
          "Entrambi. Gli oggetti WASM LWK (wallet, firmatario, client Esplora) vengono creati in memoria ed esistono solo per la sessione del browser corrente. Tuttavia, la frase mnemonica e l'indirizzo derivato sono persistiti in localStorage, quindi il wallet può essere automaticamente ripristinato quando torni. Non c'è un database lato server che memorizza il tuo wallet — tutto risiede nel tuo browser.",
        "Come è collegato il AMP ID al wallet LWK?":
          "In modalità AMP ID, il AMP ID che fornisci viene usato direttamente come la tua identità, e un wallet di firma LWK viene auto-provisionato e collegato lato server. In modalità solo-LWK, i primi 20 caratteri del tuo indirizzo reale Liquid testnet servono come pseudo-AMP-ID. In produzione, il AMP ID è l'identità autorevole, con l'API AMP usata per verificare i tuoi possessi allo snapshot block.",
        "Il mio mnemonico è sicuro in localStorage?":
          "Per l'uso su testnet, localStorage è accettabile. Per la produzione, memorizzare un mnemonico in localStorage è un rischio di sicurezza — non sopravvive tra dispositivi ed è vulnerabile ad attacchi XSS. L'architettura di produzione associa i wallet lato server al tuo AMP ID, crittografati a riposo, o si affida interamente alla firma con Blockstream App / hardware Jade.",
      },
      securityPrivacy: {
        "I miei possessi (nAAPL, nMSFT, ecc.) sono visibili quando invio un'istruzione?":
          "No. I tuoi possessi di token non vengono mai esposti on-chain quando invii un'istruzione. La transazione sposta solo 1 sat di L-BTC — nessun token equity viene toccato o trasferito. Inoltre, le Transazioni Confidenziali di Liquid offuscano anche l'importo L-BTC e il tipo di asset da osservatori terzi. Nessuno che guardi la blockchain può vedere quali token possiedi o quanti.",
        "Cosa può vedere esattamente qualcuno sulla blockchain?":
          "Un osservatore esterno può solo vedere che un particolare indirizzo ha inviato una transazione offuscata a se stesso. Non possono vedere: (1) l'importo (1 sat, offuscato da CT), (2) il tipo di asset (L-BTC, offuscato da CT), (3) la tua scelta di istruzione (memorizzata off-chain), (4) i tuoi possessi di token, né (5) il tuo peso di istruzione. La transazione è essenzialmente opaca per terze parti.",
        "La mia scelta di istruzione (Favorevole/Contrario) è privata?":
          "Attualmente, sì — la tua scelta di istruzione è registrata off-chain con il backend e collegata al tuo txid on-chain. Non è incorporata nella transazione stessa. In una futura versione di produzione, potrebbe essere aggiunto un memo OP_RETURN per una completa verificabilità, il che renderebbe la scelta leggibile pubblicamente. Tuttavia, anche allora, i tuoi possessi e il peso di istruzione rimarrebbero privati.",
        "Le istruzioni possono essere manipolate?":
          "L'integrità delle istruzioni è protetta da molteplici meccanismi: (1) Il peso basato su snapshot impedisce l'acquisto di token dopo la creazione dell'evento, (2) Un'istruzione per hodler impedisce duplicati, (3) L'immutabilità della blockchain Liquid impedisce alterazioni delle transazioni, (4) Ogni istruzione è ancorata a un txid verificabile on-chain, e (5) La registrazione AMP garantisce che partecipino solo hodler verificati KYC.",
        "Cosa succede se la piattaforma si blocca durante una finestra di istruzione?":
          "Le istruzioni già inviate sono registrate permanentemente sulla blockchain Liquid indipendentemente dallo stato della piattaforma. La finestra di istruzione è misurata in blocchi, non in tempo reale, quindi un'interruzione temporanea della piattaforma non influisce sulla finestra. Il txid on-chain serve come prova immutabile della tua partecipazione.",
      },
    },
  },
  categories: {
    board_election: "Elezione del Consiglio di Amministrazione",
    say_on_pay: "Say-on-Pay (Compensazione Esecutiva)",
    auditor_ratification: "Ratifica del Revisore",
    merger_acquisition: "Fusione o Acquisizione",
    dividend_distribution: "Elezione di Distribuzione",
    stock_action: "Azione Azionaria (Frazionamento / Raggruppamento)",
    bylaw_amendment: "Modifica Statuto / Atto Costitutivo",
    capital_action: "Azione di Capitale (Emissione / Riacquisto)",
    shareholder_proposal: "Istruzione Generale Hodler",
    shareholder_esg: "ESG / Sostenibilità",
    shareholder_exec_comp: "Limiti alla Compensazione Esecutiva",
    shareholder_governance: "Riforma della Governance",
    shareholder_transparency: "Trasparenza / Disclosure",
    shareholder_rights: "Diritti degli Hodler",
    governance: "Modifica di Governance",
    other: "Altro",
    community_new_underlying: "Richiedi Nuovo Sottostante",
    community_listing_venue: "Richiedi Sede di Quotazione",
    community_bespoke_product: "Richiedi Prodotto Su Misura",
    community_program_features: "Richiedi Funzionalità del Programma",
    community_market_structure: "Modifiche alla Struttura di Mercato",
    community_transparency: "Documentazione e Trasparenza",
    community_other: "Altra Proposta della Community",
  },
  categoryDescs: {
    board_election: "Eleggere o rieleggere membri del consiglio di amministrazione",
    say_on_pay: "Istruzione consultiva sui pacchetti di compensazione esecutiva",
    auditor_ratification:
      "Ratificare la nomina del revisore esterno / società di revisione",
    merger_acquisition:
      "Istruzione su una proposta di fusione, acquisizione o combinazione aziendale",
    dividend_distribution:
      "Eleggere il metodo di pagamento dei dividendi o la preferenza di distribuzione (es. contanti vs reinvestimento)",
    stock_action:
      "Azione societaria non elettiva — diritti dei token aggiornati tramite registro",
    bylaw_amendment:
      "Istruzione su modifiche all'atto costitutivo, allo statuto o agli articoli di incorporazione",
    capital_action:
      "Istruzione su nuova emissione di azioni, programma di riacquisto o offerta di capitale",
    shareholder_proposal:
      "Istruzione generale per l'agenda di governance (consultiva, non vincolante)",
    shareholder_esg:
      "Richiesta di politica ambientale, sociale o di governance (es. disclosure climatica, DEI)",
    shareholder_exec_comp:
      "Richiedere limiti alla retribuzione esecutiva, politiche di clawback o disclosure del rapporto retributivo",
    shareholder_governance:
      "Richiedere modifiche alla governance come accesso alle deleghe, presidente indipendente o voto a maggioranza",
    shareholder_transparency:
      "Richiedere ulteriore disclosure su lobbying, spese politiche o catena di approvvigionamento",
    shareholder_rights:
      "Proporre diritti di assemblea speciale, consenso scritto o abrogazione anti-acquisizione",
    governance:
      "Modifiche al framework di governance, regole di istruzione o soglie di quorum",
    other: "Qualsiasi altra questione per la considerazione degli hodler",
    community_new_underlying: "Proponi un nuovo asset sottostante per la tokenizzazione NexBridge (es. 'Voglio esposizione a [asset]')",
    community_listing_venue: "Richiedi la quotazione su un nuovo exchange, banca, broker o integrazione con una piattaforma",
    community_bespoke_product: "Richiedi uno strumento personalizzato con parametri specifici (paniere, coperto, rendimento, limiti)",
    community_program_features: "Suggerisci funzionalità del portale, reportistica, notifiche, UX delle azioni societarie o API",
    community_market_structure: "Proponi modifiche alla struttura di mercato, regole di negoziazione o processi di regolamento",
    community_transparency: "Richiedi più divulgazioni, formato della prova di riserve, cadenza degli audit o chiarezza dei termini",
    community_other: "Qualsiasi altro commento o suggerimento della community per la piattaforma",
  },
};
