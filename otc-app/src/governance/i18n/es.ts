import type { Translations } from "./types";

export const es: Translations = {
  nav: {
    governance: "Gobernanza de Acciones",
    community: "NexVoice",
    submitInstruction: "Enviar Instrucción",
    faq: "FAQ",
  },
  common: {
    backToDashboard: "Volver al Panel",
    launchApp: "Abrir App",
    submitInstruction: "Enviar Instrucción",
    connectWallet: "Conectar Wallet",
    cancel: "Cancelar",
    all: "Todos",
    active: "Activos",
    closed: "Cerrados",
    filter: "Filtrar:",
    allInstruments: "Todos los Instrumentos",
    votes: "votos",
    votingPower: "poder de voto",
    quorum: "quórum",
    quorumReached: "Quórum alcanzado",
    quorumPending: "Quórum pendiente",
    quorumNotReached: "Quórum No Alcanzado",
    participation: "Participación",
    totalVotes: "votos totales",
    winner: "Ganador",
    hodler: "Hodler",
    management: "Dirección",
    instruction: "Instrucción",
    nonBinding: "No vinculante",
    passed: "Aprobada",
    rejected: "Rechazada",
    approvedAdvisory: "Aprobada (Consultiva)",
    liveOnLiquid: "En vivo en Liquid Network",
    ended: "Finalizado",
    left: "restante",
  },
  home: {
    title: "Instrucciones On-Chain de Hodlers para",
    titleHighlight: "Acciones Corporativas",
    subtitle:
      "NexTR refleja los avisos del custodio, recopila instrucciones elegibles de hodlers on-chain y refleja los resultados a través de un depositario regulado y una infraestructura de custodia.",
    oneLiner:
      "Las acciones ómnibus siguen las reglas del programa (ej. mayoría); las elecciones asignables pueden aplicarse por hodler a nivel de token.",
    featuresTitle: "Construido con Seguridad de Grado Bitcoin",
    featuresSubtitle:
      "NexTR aprovecha la sidechain federada Liquid Network para gobernanza institucional de instrucciones de hodlers.",
    howItWorksTitle: "Cómo Funciona",
    howItWorksSubtitle:
      "Un proceso simple y transparente desde la conexión del wallet hasta la verificación on-chain de instrucciones.",
    features: {
      verifiable: {
        title: "Verificable On-Chain",
        description:
          "Cada instrucción de hodler se registra como una transacción en Liquid Network con prueba criptográfica, auditable por cualquiera.",
      },
      confidential: {
        title: "Transacciones Confidenciales",
        description:
          "Las transacciones confidenciales de Liquid protegen los saldos de los hodlers manteniendo la verificabilidad de las instrucciones.",
      },
      finality: {
        title: "Finalidad en 2 Minutos",
        description:
          "Las instrucciones se liquidan en menos de 2 minutos con los bloques de 1 minuto de Liquid y finalidad en 2 confirmaciones.",
      },
      amp: {
        title: "Activos Securizados con AMP",
        description:
          "Los instrumentos NexTR son Activos de Transferencia Restringida gestionados mediante Blockstream AMP con pleno cumplimiento KYC.",
      },
    },
    stats: {
      activeEvents: "Eventos Activos",
      instructionsRecorded: "Instrucciones Registradas",
      instrumentsSupported: "Instrumentos Soportados",
      liquidBlockHeight: "Altura de Bloque Liquid",
    },
    steps: {
      s1: {
        title: "Conectar Wallet",
        desc: "Vincula tu wallet Blockstream App usando tu AMP ID de Managed Assets. Tus saldos de tokens determinan tu peso de instrucción.",
      },
      s2: {
        title: "Revisar Eventos",
        desc: "Explora los eventos de instrucción activos para tus instrumentos NexTR. Cada evento detalla la acción corporativa y las opciones disponibles.",
      },
      s3: {
        title: "Enviar Instrucción",
        desc: "Selecciona tu opción y firma una transacción Liquid. Se envía un dust amount como señal — conservas todos tus tokens.",
      },
      s4: {
        title: "Verificar On-Chain",
        desc: "Tu instrucción se registra como una transacción en Liquid Network con un memo OP_RETURN. Cualquiera puede verificar los resultados.",
      },
    },
  },
  dashboard: {
    title: "Gobernanza",
    subtitle:
      "Envía instrucciones sobre eventos de acciones corporativas para instrumentos NexTR",
    activeEvents: "Eventos Activos",
    completed: "Completados",
    supportedInstruments: "Instrumentos Soportados",
    yourHoldings: "Tus Tenencias",
    holdingsTitle: "Tus Tenencias de Instrumentos NexTR",
    noEventsFound: "No se encontraron eventos",
  },
  vote: {
    submitYourInstruction: "Envía Tu Instrucción",
    instructionWeight: "Peso de instrucción:",
    submitOnChain: "Enviar Instrucción On-Chain",
    connectWalletTitle: "Conecta Tu Wallet",
    connectWalletDesc:
      "Conecta tu wallet Blockstream App para enviar tu instrucción. Tu peso de instrucción está determinado por tu",
    instructionRecorded: "Instrucción Registrada",
    instructionBroadcast: "Instrucción Transmitida On-Chain",
    youSelected: "Seleccionaste",
    withWeight: "con",
    confirmTitle: "Confirma Tu Instrucción",
    confirmDescMock:
      "Esto registrará tu instrucción como una transacción en Liquid Network.",
    confirmDescLwk:
      "Esto transmitirá una transacción real en Liquid testnet.",
    event: "Evento",
    yourInstruction: "Tu instrucción",
    network: "Red",
    fee: "Comisión",
    signBroadcast: "Firmar y Transmitir",
    signSubmit: "Firmar y Enviar",
    broadcasting: "Transmitiendo...",
    signing: "Firmando...",
    securityLwk:
      "Tu instrucción se transmitirá como una transacción real en Liquid testnet. Se usa un envío de 1 sat L-BTC dust como señal de instrucción. La transacción se firma en el navegador mediante LWK WASM — tus claves nunca salen del navegador.",
    securityMock:
      "Tu instrucción se registrará como una transacción en Liquid Network con un memo OP_RETURN. Se te pedirá que firmes la transacción con tu wallet. Se envía un dust amount de {asset} como señal de instrucción — no pierdes tus tokens.",
    viewOnExplorer: "Ver en Blockstream Explorer",
    instructionFailed: "La instrucción falló",
  },
  results: {
    finalResults: "Resultados Finales",
    instructionBreakdown: "Desglose de Instrucciones",
    participationAndQuorum: "Participación y Quórum",
    eventDetails: "Detalles del Evento",
    option: "Opción",
    power: "Poder",
    verifyAll: "Verificar Todas las Instrucciones en Blockstream Explorer",
    category: "Categoría",
    resolutionType: "Tipo de Resolución",
    meetingType: "Tipo de Asamblea",
    recordDate: "Fecha de Registro",
    instructionWindow: "Ventana de instrucción",
    snapshotBlock: "Bloque snapshot",
    totalParticipants: "Total de participantes",
    totalInstructionWeight: "Peso total de instrucciones",
    approvalThreshold: "Umbral de aprobación",
    advisoryNonBinding: "Consultiva (no vinculante)",
  },
  create: {
    title: "Enviar Instrucción",
    subtitle: "Envía una instrucción de gobernanza para hodlers de instrumentos NexTR",
    walletRequired: "Wallet Requerido",
    walletRequiredDesc:
      "Conecta tu wallet Blockstream App para enviar instrucciones de gobernanza para instrumentos NexTR.",
    anyHodlerTitle: "Cualquier hodler de tokens puede enviar una instrucción",
    anyHodlerDesc:
      "A diferencia de los mercados tradicionales que requieren $2,000+ en tenencias (Regla SEC 14a-8), NexTR permite a cualquier hodler — incluso con 1 token — enviar instrucciones de gobernanza. El registro on-chain de instrucciones elimina los costos administrativos que justificaban umbrales altos.",
    categoryTitle: "Categoría de Instrucción",
    categoryDesc:
      "Selecciona el tipo de instrucción de hodler. Las acciones exclusivas de la dirección (elecciones de junta, M&A, dividendos) son creadas por el emisor.",
    categoryDescCommunity: "Selecciona el tema para tu consulta comunitaria. Todas las propuestas comunitarias son consultivas y no vinculantes — ayudan a NexBridge a medir el interés y priorizar.",
    categoryLabel: "Categoría",
    selectCategory: "Seleccionar categoría de instrucción",
    resolutionType: "Tipo de Resolución",
    proposerType: "Tipo de Proponente",
    proposerDesc:
      "Enviada por ti como hodler de tokens. Las instrucciones de la dirección son creadas por el emisor.",
    proposerDescCommunity: "Enviada por cualquier hodler de instrumentos NexTR como consulta comunitaria no vinculante.",
    detailsTitle: "Detalles de la Instrucción",
    detailsDesc: "Describe la acción corporativa o decisión de gobernanza",
    titleLabel: "Título",
    titlePlaceholder:
      "ej. Distribución Anual de Dividendos para Hodlers de nAAPL",
    summaryLabel: "Resumen",
    summaryPlaceholder: "Un breve resumen para la lista de propuestas",
    fullDescLabel: "Descripción Completa",
    fullDescPlaceholder:
      "Proporciona todos los detalles sobre la propuesta, incluyendo justificación, impacto y plan de implementación...",
    characters: "caracteres",
    configuration: "Configuración",
    configurationDesc: "Establece los parámetros de instrucción para este evento",
    targetAsset: "Activo Objetivo",
    selectAsset: "Seleccionar activo",
    quorumRequired: "Quórum Requerido (%)",
    autoSetNote: "(establecido automáticamente por tipo de resolución)",
    instructionWindow: "Ventana de Instrucción",
    day: "día",
    days: "días",
    optionsTitle: "Opciones de Instrucción",
    optionsDesc:
      "Define las opciones que los hodlers pueden seleccionar (mínimo 2, máximo 10)",
    optionLabel: "Etiqueta de opción",
    optionDescPlaceholder: "Descripción (opcional)",
    addOption: "Agregar Opción",
    submitNote:
      "Enviar una instrucción requiere una transacción en Liquid Network. Se te pedirá que firmes con tu wallet.",
    submitting: "Enviando...",
  },
  community: {
    title: "NexBridge Voice",
    subtitle: "Consultas comunitarias no vinculantes para la plataforma y programa NexBridge",
    votingWeightExplainer: "Tu peso de voto está determinado por el valor total en dólares de todos los instrumentos NexTR que posees. Las propuestas comunitarias son consultivas y no vinculantes — señalan el interés de la comunidad pero no obligan a ninguna acción.",
    totalPortfolioValue: "Valor Total del Portafolio",
    communityProposer: "Comunidad",
    noProposalsFound: "No se encontraron propuestas de la comunidad",
    submitCommunityProposal: "Enviar Propuesta Comunitaria",
    allCategories: "Todas las Categorías",
    advisoryDisclaimer: "Las propuestas comunitarias son consultas no vinculantes que miden el sentimiento de la comunidad — similar a una verificación de temperatura. Los resultados señalan interés y ayudan a NexBridge a priorizar, pero no obligan ni imponen ninguna acción. Todas las propuestas comunitarias son consultivas por defecto.",
    advisoryDisclaimerShort: "Consultiva · No vinculante",
  },
    voteDetail: {
    time: "Tiempo",
    snapshot: "Snapshot",
    approval: "Aprobación",
    advisory: "Consultiva",
    proposedBy: "Propuesto Por",
    currentResults: "Resultados Actuales",
    timeline: "Cronología",
    created: "Creado",
    windowOpened: "Ventana de instrucción abierta",
    windowCloses: "La ventana de instrucción cierra",
    blockRange: "Rango de bloques",
    instructionVerification: "Verificación de Instrucciones",
    verificationDesc:
      "Todas las instrucciones se registran en la blockchain de Liquid Network y pueden ser verificadas de forma independiente usando cualquier explorador de bloques de Liquid.",
    verifyOnExplorer: "Verificar en Blockstream Explorer",
    boardRecommends: "La Junta Directiva recomienda",
    windowClosed: "Ventana de instrucción cerrada",
    remaining: "restante",
    advisoryNote:
      "El resultado no es vinculante pero la Junta considera el sentimiento de los hodlers en sus decisiones.",
    quorumNote:
      "Un quórum del {quorum}% del peso total de instrucciones debe participar para que el resultado sea válido.",
  },
  status: {
    draft: "Borrador",
    active: "Activo",
    closed: "Cerrado",
    executed: "Ejecutado",
    cancelled: "Cancelado",
  },
  resolution: {
    ordinary: "Ordinaria",
    special: "Especial",
    advisory: "Consultiva",
    ordinaryFull: "Resolución Ordinaria",
    specialFull: "Resolución Especial",
    advisoryFull: "Voto Consultivo",
    ordinaryDesc: "Requiere >50% de los votos emitidos",
    specialDesc: "Requiere ≥66.7% de los votos emitidos",
    advisoryDesc: "Voto consultivo no vinculante",
  },
  meeting: {
    annual: "Asamblea General Anual",
    special: "Asamblea Extraordinaria",
    writtenConsent: "Consentimiento por Escrito",
  },
  footer: {
    tagline:
      "NexTR — Gobernanza On-Chain para la Propiedad Real de Acciones Tokenizadas",
    poweredBy: "Impulsado por Blockstream AMP & LWK",
    liquidNetwork: "Liquid Network",
  },
  disclaimers: {
    execution:
      "NexTR registra las instrucciones elegibles de hodlers on-chain. La ejecución se realiza off-chain por el Depositario SPV a través de su broker/custodio, bajo la gobernanza del Trust/Trustee, y está sujeta a los Términos de Emisión y la disponibilidad de proveedores de servicios.",
    omnibusVsAllocation:
      "Algunas acciones se ejecutan como instrucción ómnibus (ej. votos por proxy), mientras que otros eventos pueden reflejarse por hodler a nivel de token (ej. pago en efectivo vs elección de reinversión).",
    footer:
      "NexTR es un portal informativo de gobernanza para hodlers elegibles de instrumentos NexTR. La participación está sujeta a elegibilidad, los Términos de Emisión aplicables y la disponibilidad de proveedores de servicios. Nada en este sitio constituye una oferta o solicitud.",
  },
  faq: {
    title: "Preguntas Frecuentes",
    subtitle:
      "Aprende cómo funciona la gobernanza on-chain de instrucciones de hodlers para instrumentos NexTR en Liquid Network.",
    readyToParticipate: "¿Listo para participar?",
    readyDesc:
      "Conecta tu wallet y envía instrucciones sobre eventos activos.",
    goToDashboard: "Ir al Panel",
    sections: {
      gettingStarted: "Primeros Pasos",
      governanceWorkflow: "Flujo de Gobernanza y Roles",
      instructionEventTypes: "Tipos de Eventos de Instrucción",
      eventCategories: "Categorías de Eventos",
      hodlerSubmitted: "Instrucciones Enviadas por Hodlers",
      quorumAndApproval: "Quórum y Umbrales de Aprobación",
      liquidNetwork: "Liquid Network y Tecnología",
      onChainDetails: "Qué se Registra On-Chain",
      gaidAndWallets: "AMP ID y Wallets",
      securityPrivacy: "Seguridad y Privacidad",
    },
    qs: {
      gettingStarted: {
        "¿Qué es NexTR?":
          "NexTR es un portal de gobernanza on-chain que recopila instrucciones verificables de hodlers para instrumentos NexTR (acciones tokenizadas emitidas por NexBridge). Registra las instrucciones elegibles de hodlers en la blockchain de Liquid Network. La ejecución de esas instrucciones se realiza off-chain por el Depositario SPV a través de su broker/custodio, bajo la gobernanza del Trust/Trustee, y sujeta a los Términos de Emisión.",
        "¿Soy accionista directo de Apple, Microsoft o Tesla?":
          "No. Los hodlers de instrumentos NexTR no son accionistas directos de las empresas subyacentes. El Depositario SPV es el titular legal y principal de negociación. Cuando envías una instrucción a través de NexTR, estás proporcionando tu preferencia como hodler elegible de instrumentos NexTR. El Depositario SPV entonces ejecuta una instrucción ómnibus a través del broker/custodio de acuerdo con las reglas del programa.",
        "¿Qué wallet necesito?":
          "NexTR usa el wallet Blockstream App con el tipo de cuenta \"Managed Assets\" (AMP). Los instrumentos NexTR son Activos de Transferencia Restringida en Liquid Network, que requieren registro AMP. Te conectas usando tu AMP ID (AMP Account ID), que identifica de forma única tu cuenta registrada.",
        "¿Funciona WalletConnect con NexTR?":
          "No. Liquid Network actualmente no soporta WalletConnect. NexTR usa el AMP ID (AMP Account ID) de tu wallet Blockstream App para identificar y autenticar tu cuenta. Este es el enfoque estándar para activos gestionados por AMP en Liquid.",
        "¿Con qué instrumentos puedo participar?":
          "Puedes enviar instrucciones para cualquier instrumento NexTR que poseas, incluyendo nAAPL (Apple), nMSFT (Microsoft), nTSLA (Tesla), nSPY (S&P 500), nNSDQ (Nasdaq 100), y USTBL (US Treasury Bills). Tu peso de instrucción es igual al número de tokens que posees en el bloque snapshot.",
      },
      governanceWorkflow: {
        "¿Qué es el Depositario SPV?":
          "El Depositario SPV es el titular legal y principal de negociación de los valores subyacentes. Es el titular de la cuenta en el broker/custodio, envía instrucciones en nombre de todos los hodlers y recibe los productos de acciones corporativas. Opera bajo la supervisión del Trust/Trustee.",
        "¿Qué papel juega NexBridge?":
          "NexBridge es el Patrocinador del Programa y Emisor. Define los Términos de Emisión y las reglas del programa, publica comunicaciones para inversores y opera este portal bajo la política de ejecución. NexBridge no posee los valores subyacentes directamente — eso corresponde al Depositario SPV.",
        "¿Cuál es el rol del Trust/Trustee?":
          "El Trust/Trustee proporciona titularidad blindada contra quiebra y supervisión del Depositario SPV. Asegura que todas las acciones sigan la documentación del programa y que los intereses de los hodlers de instrumentos estén protegidos.",
        "¿Cómo fluyen las instrucciones desde NexTR hasta la ejecución?":
          "El flujo es: (1) Los hodlers envían instrucciones on-chain vía NexTR, (2) NexTR agrega y registra las instrucciones elegibles, (3) El Depositario SPV recibe el resultado agregado, (4) El Depositario SPV envía una instrucción ómnibus a su broker/custodio, (5) El broker/custodio ejecuta la instrucción a nivel de emisor. Para elecciones (ej. efectivo vs reinversión), los resultados se reflejan por hodler a nivel de token.",
      },
      instructionEventTypes: {
        "¿Qué es un Voto de Instrucción?":
          "Un Voto de Instrucción es un evento donde los hodlers proporcionan su preferencia de gobernanza (ej. A Favor, En Contra, Abstención en un elemento de proxy vote). Usa ejecución ómnibus: el Depositario SPV envía una única instrucción agregada a través del broker/custodio. Así se manejan los proxy votes, elecciones de junta y elementos de say-on-pay.",
        "¿Qué es una Elección?":
          "Una Elección es un evento donde los hodlers eligen entre opciones asignables — por ejemplo, recibir una distribución en efectivo o reinvertirla. A diferencia de los votos de instrucción, los resultados de la elección se reflejan por hodler a nivel de token (pago en efectivo vs reinversión) conforme a los Términos de Emisión.",
        "¿Qué es una Acción Corporativa No Electiva?":
          "Las acciones corporativas no electivas (splits de acciones, fusiones, cambios de símbolo) no requieren instrucciones de hodlers. Se reflejan automáticamente en los derechos de token mediante actualizaciones del registro de acuerdo con los Términos de Emisión. NexTR las muestra como eventos informativos.",
        "¿Pierdo mis tokens al enviar una instrucción?":
          "No. Enviar una instrucción envía un dust amount (1 satoshi) de L-BTC como transacción de señal. Esto es insignificante y solo sirve para crear un registro verificable on-chain. Tu saldo de tokens permanece efectivamente sin cambios.",
        "¿Puedo cambiar mi instrucción después de enviarla?":
          "No. Una vez que una instrucción se transmite en Liquid Network, es inmutable. Esto refleja la votación tradicional por proxy donde los votos son definitivos una vez enviados. Considera tu elección cuidadosamente antes de confirmar.",
        "¿Puedo verificar que mi instrucción fue registrada?":
          "Sí. Cada instrucción es una transacción de Liquid Network que puede verificarse de forma independiente usando Blockstream Explorer. El ID de transacción se muestra después de enviar y puedes consultarlo en cualquier momento.",
      },
      eventCategories: {
        "¿Qué tipos de eventos soporta NexTR?":
          "NexTR soporta las mismas categorías que se encuentran en la gobernanza institucional tradicional: Elecciones de Junta Directiva, Say-on-Pay (compensación ejecutiva), Ratificación de Auditor, Fusiones y Adquisiciones, Elecciones de Distribución, Acciones sobre Acciones (splits), Enmiendas de Estatutos, Acciones de Capital (emisión/recompra), Instrucciones de Hodlers, y Cambios de Gobernanza.",
        "¿Qué es una Resolución Ordinaria?":
          "Una resolución ordinaria requiere aprobación de más del 50% de las instrucciones emitidas, con un quórum del 10% (participación mínima). Esto aplica a asuntos rutinarios como elecciones de junta y elecciones de distribución.",
        "¿Qué es una Resolución Especial?":
          "Una resolución especial requiere aprobación de al menos el 66.7% (supermayoría de dos tercios) de las instrucciones emitidas, con un quórum más alto del 25%. Esto aplica a cambios significativos como fusiones, enmiendas de estatutos, acciones de capital y cambios de gobernanza.",
        "¿Qué es un Voto Consultivo?":
          "Las instrucciones consultivas no son vinculantes — el resultado expresa el sentimiento de los hodlers pero no obliga legalmente a la junta. Say-on-Pay, ratificaciones de auditor e instrucciones enviadas por hodlers son típicamente consultivas. Se espera que la junta considere el resultado.",
        "¿Qué significa la Recomendación de la Junta?":
          "Para eventos iniciados por la dirección, la Junta Directiva proporciona una recomendación (generalmente \"A FAVOR\"). Esto es similar a las declaraciones de proxy en las finanzas tradicionales. Las instrucciones enviadas por hodlers típicamente no llevan recomendación de la junta.",
      },
      hodlerSubmitted: {
        "¿Puedo enviar una instrucción si solo tengo 1 token?":
          "Sí. A diferencia de los mercados tradicionales donde la Regla SEC 14a-8 requiere de $2,000 a $25,000 en tenencias, NexTR permite a cualquier hodler — incluso con solo 1 token — enviar una instrucción de gobernanza. La gobernanza on-chain elimina la sobrecarga administrativa que justificaba esos altos umbrales tradicionales.",
        "¿Cuáles son los requisitos para enviar una instrucción?":
          "Necesitas: (1) Al menos 1 token de cualquier instrumento NexTR, (2) Un período de tenencia de al menos 1,440 bloques (~1 día) antes de enviar, y (3) Un wallet Blockstream App conectado.",
        "¿Hay límites para reenviar instrucciones fallidas?":
          "Sí. Adaptado de las reglas de reenvío de la SEC, si una instrucción recibe menos del 5% de apoyo en el primer intento, no puede reenviarse durante 3 años. El umbral sube al 15% en el segundo intento y al 25% en el tercero. Esto previene el spam mientras permite reconsiderar ideas populares.",
        "¿Cuál es la diferencia entre instrucciones de Dirección y de Hodlers?":
          "Las instrucciones de la dirección son iniciadas por la junta o el liderazgo de la empresa (ej. elecciones de junta, aprobaciones de distribución, M&A). Las instrucciones de hodlers son enviadas por hodlers individuales de tokens para poner temas en la agenda. Las instrucciones de la dirección pueden llevar recomendación de la junta; las instrucciones de hodlers son típicamente consultivas.",
      },
      quorumAndApproval: {
        "¿Qué es un quórum?":
          "El quórum es el porcentaje mínimo del peso total de instrucciones que debe participar para que un resultado sea válido. Si no se alcanza el quórum, el evento falla independientemente del resultado de la instrucción.",
        "¿Cuáles son los umbrales de quórum?":
          "Las resoluciones ordinarias requieren un quórum del 10%. Las resoluciones especiales requieren un quórum del 25%. Las instrucciones consultivas también usan un quórum del 10%, aunque al ser no vinculantes la junta puede considerar el resultado de todas formas.",
        "¿Qué es la Fecha de Registro?":
          "La Fecha de Registro (equivalente al \"bloque snapshot\" on-chain) determina qué hodlers son elegibles para participar y su peso de instrucción. Solo los hodlers en la Fecha de Registro pueden enviar instrucciones.",
      },
      liquidNetwork: {
        "¿Por qué NexTR está construido sobre Liquid Network?":
          "Liquid Network es una sidechain de Bitcoin diseñada para activos financieros. Ofrece: bloques de 1 minuto (vs 10 min en Bitcoin), Transacciones Confidenciales que ocultan montos y tipos de activos de observadores externos, Activos de Transferencia Restringida vía AMP para cumplimiento regulatorio, y las garantías de seguridad de una sidechain federada de Bitcoin.",
        "¿Qué es AMP y por qué importa?":
          "AMP (Asset Management Platform) de Blockstream gestiona Activos de Transferencia Restringida en Liquid. Los instrumentos NexTR son gestionados por AMP, lo que significa que solo usuarios registrados (verificados por KYC) pueden tenerlos y transferirlos. Esto asegura el cumplimiento regulatorio manteniendo la transparencia on-chain. En producción, la API de AMP verifica el saldo de tokens de un hodler en el bloque snapshot.",
        "¿Cómo se registran las instrucciones on-chain?":
          "Cada instrucción es una transacción Liquid que envía 1 satoshi de L-BTC (no el token de equity) a la propia dirección del hodler — un auto-envío. Esto crea una prueba de participación verificable públicamente. La elección real de instrucción (A Favor/En Contra/Abstención) se registra off-chain con el backend, vinculada al txid on-chain. Una mejora futura incluirá un memo NEXTR_VOTE en una salida OP_RETURN para auditabilidad completa on-chain.",
        "¿Qué es un PSET?":
          "PSET (Partially Signed Elements Transaction) es el equivalente en Liquid del PSBT de Bitcoin. Cuando envías una instrucción, NexTR construye un PSET con la transacción dust de L-BTC, que se firma usando el firmante LWK (Liquid Wallet Kit). El PSET firmado se finaliza y transmite a la red Liquid a través de la API de Esplora.",
        "¿Qué es LWK (Liquid Wallet Kit)?":
          "LWK es una librería basada en WASM de Blockstream para construir wallets Liquid directamente en el navegador. NexTR usa LWK para crear y gestionar wallets en Liquid testnet — generando mnemónicos, derivando descriptores SLIP-77 ciegos, sincronizando UTXOs vía Esplora, construyendo PSETs, firmando y transmitiendo transacciones. Todo esto se ejecuta del lado del cliente sin enviar claves a un servidor.",
      },
      onChainDetails: {
        "¿Qué es exactamente la transacción de instrucción?":
          "La transacción de instrucción es un simple auto-envío: tu wallet LWK envía 1 satoshi de L-BTC a tu propia dirección. Eso es todo. No se mueven tokens de equity, no se incluyen metadatos de instrucción en la implementación actual. La transacción sirve como ancla inmutable de prueba de participación en la blockchain de Liquid.",
        "¿Qué datos son visibles en la blockchain?":
          "Debido a las Transacciones Confidenciales de Liquid, muy poco es visible. Un observador externo puede ver: (1) que ocurrió una transacción entre direcciones, y (2) la comisión de la transacción. El monto (1 sat), el tipo de activo (L-BTC), y el hecho de que es un auto-envío están todos ocultos. No aparecen tenencias, elección de instrucción, AMP ID, ni información del evento on-chain.",
        "¿Qué NO está on-chain?":
          "Los siguientes datos NO se registran en la blockchain: tu elección de instrucción (A Favor/En Contra/Abstención), el ID del evento, tu AMP ID, tu peso de instrucción, tus tenencias de tokens (nAAPL, nMSFT, etc.), y el memo NEXTR_VOTE. Todo esto se gestiona off-chain por el backend, vinculado al txid on-chain.",
        "¿Cómo sabe el backend qué instrucción envié?":
          "Después de que la transacción dust se transmite y se obtiene un txid, el wallet llama a un endpoint de registro del backend con el txid, ID del evento, ID de opción y tu dirección. El txid es el enlace criptográfico entre tu acción on-chain y tu registro de instrucción off-chain. Este enfoque de dos capas mantiene las tenencias privadas mientras preserva la verificabilidad.",
        "¿Serán las instrucciones completamente auditables on-chain en el futuro?":
          "Sí. El código incluye un formato de memo de instrucción (NEXTR_VOTE:<eventId>:<optionId>:<holderAmpId>) diseñado para incluirse en una salida OP_RETURN. Una vez que el TxBuilder de LWK soporte OP_RETURN de forma nativa, este memo se añadirá a las transacciones de instrucción — haciendo las elecciones auditables on-chain de forma independiente sin revelar las tenencias.",
      },
      gaidAndWallets: {
        "¿Qué es un AMP ID?":
          "Un AMP ID (AMP Account ID) es el identificador único de tu cuenta en el wallet Blockstream App. Es una cadena alfanumérica (10-100 caracteres) que identifica tu cuenta registrada en AMP. Puedes encontrarlo en Blockstream App en Managed Assets → Recibir. El AMP ID es como la plataforma sabe qué hodler registrado eres.",
        "¿Cuál es la diferencia entre modo AMP ID y modo LWK?":
          "El modo AMP ID se conecta usando tu ID de cuenta de Blockstream App — la ruta de producción para hodlers verificados por KYC. El modo LWK crea un wallet real de Liquid testnet en tu navegador usando Liquid Wallet Kit (WASM) para probar transacciones on-chain reales. En producción, ambos modos producen transacciones on-chain reales.",
        "¿El wallet LWK se crea por sesión o es persistente?":
          "Ambos. Los objetos WASM de LWK (wallet, firmante, cliente Esplora) se crean en memoria y existen solo para la sesión actual del navegador. Sin embargo, la frase mnemónica y la dirección derivada se persisten en localStorage, por lo que el wallet puede restaurarse automáticamente cuando regresas. No hay base de datos del lado del servidor almacenando tu wallet — todo vive en tu navegador.",
        "¿Cómo se vincula el AMP ID con el wallet LWK?":
          "En modo AMP ID, el AMP ID que proporcionas se usa directamente como tu identidad, y un wallet de firma LWK se provisiona automáticamente y se vincula del lado del servidor. En modo solo-LWK, los primeros 20 caracteres de tu dirección real de Liquid testnet sirven como pseudo-AMP-ID. En producción, el AMP ID es la identidad autoritativa, con la API de AMP usada para verificar tus tenencias en el bloque snapshot.",
        "¿Es seguro mi mnemónico en localStorage?":
          "Para uso en testnet, localStorage es aceptable. Para producción, almacenar un mnemónico en localStorage es un riesgo de seguridad — no sobrevive entre dispositivos y es vulnerable a ataques XSS. La arquitectura de producción asocia wallets del lado del servidor con tu AMP ID, encriptados en reposo, o depende completamente de la firma con Blockstream App / hardware Jade.",
      },
      securityPrivacy: {
        "¿Son visibles mis tenencias (nAAPL, nMSFT, etc.) cuando envío una instrucción?":
          "No. Tus tenencias de tokens nunca se exponen on-chain cuando envías una instrucción. La transacción solo mueve 1 sat de L-BTC — no se tocan ni transfieren tokens de equity. Además, las Transacciones Confidenciales de Liquid ocultan incluso el monto de L-BTC y el tipo de activo de observadores externos. Nadie que mire la blockchain puede ver qué tokens posees ni cuántos.",
        "¿Qué puede ver exactamente alguien en la blockchain?":
          "Un observador externo solo puede ver que una dirección particular envió una transacción oculta a sí misma. No pueden ver: (1) el monto (1 sat, oculto por CT), (2) el tipo de activo (L-BTC, oculto por CT), (3) tu elección de instrucción (almacenada off-chain), (4) tus tenencias de tokens, ni (5) tu peso de instrucción. La transacción es esencialmente opaca para terceros.",
        "¿Es privada mi elección de instrucción (A Favor/En Contra)?":
          "Actualmente, sí — tu elección de instrucción se registra off-chain con el backend y se vincula a tu txid on-chain. No está incrustada en la transacción misma. En una futura versión de producción, se puede añadir un memo OP_RETURN para auditabilidad completa, lo que haría la elección legible públicamente. Sin embargo, incluso entonces, tus tenencias y peso de instrucción permanecerían privados.",
        "¿Se pueden manipular las instrucciones?":
          "La integridad de las instrucciones está protegida por múltiples mecanismos: (1) El peso basado en snapshot previene la compra de tokens después de la creación del evento, (2) Una instrucción por hodler previene duplicados, (3) La inmutabilidad de la blockchain de Liquid previene alteraciones de transacciones, (4) Cada instrucción está anclada a un txid verificable on-chain, y (5) El registro AMP asegura que solo participen hodlers verificados por KYC.",
        "¿Qué pasa si la plataforma se cae durante una ventana de instrucción?":
          "Las instrucciones ya enviadas están permanentemente registradas en la blockchain de Liquid independientemente del estado de la plataforma. La ventana de instrucción se mide en bloques, no en tiempo real, por lo que una caída temporal de la plataforma no afecta la ventana. El txid on-chain sirve como prueba inmutable de que participaste.",
      },
    },
  },
  categories: {
    board_election: "Elección de Junta Directiva",
    say_on_pay: "Say-on-Pay (Compensación Ejecutiva)",
    auditor_ratification: "Ratificación de Auditor",
    merger_acquisition: "Fusión o Adquisición",
    dividend_distribution: "Elección de Distribución",
    stock_action: "Acción sobre Acciones (Split / Split Inverso)",
    bylaw_amendment: "Enmienda de Estatutos / Carta Constitutiva",
    capital_action: "Acción de Capital (Emisión / Recompra)",
    shareholder_proposal: "Instrucción General de Hodlers",
    shareholder_esg: "ESG / Sostenibilidad",
    shareholder_exec_comp: "Límites de Compensación Ejecutiva",
    shareholder_governance: "Reforma de Gobernanza",
    shareholder_transparency: "Transparencia / Divulgación",
    shareholder_rights: "Derechos de Hodlers",
    governance: "Cambio de Gobernanza",
    other: "Otro",
    community_new_underlying: "Solicitar Nuevo Subyacente",
    community_listing_venue: "Solicitar Lugar de Cotización",
    community_bespoke_product: "Solicitar Producto a Medida",
    community_program_features: "Solicitar Funciones del Programa",
    community_market_structure: "Cambios en Estructura de Mercado",
    community_transparency: "Documentación y Transparencia",
    community_other: "Otra Propuesta Comunitaria",
  },
  categoryDescs: {
    board_election: "Elegir o reelegir miembros de la junta directiva",
    say_on_pay: "Instrucción consultiva sobre paquetes de compensación ejecutiva",
    auditor_ratification:
      "Ratificar el nombramiento del auditor externo / firma contable",
    merger_acquisition:
      "Instrucción sobre una fusión, adquisición o combinación de negocios propuesta",
    dividend_distribution:
      "Elegir método de pago de dividendos o preferencia de distribución (ej. efectivo vs reinversión)",
    stock_action:
      "Acción corporativa no electiva — derechos de token actualizados vía registro",
    bylaw_amendment:
      "Instrucción sobre enmiendas a la carta constitutiva, estatutos o artículos de incorporación",
    capital_action:
      "Instrucción sobre nueva emisión de acciones, programa de recompra u oferta de capital",
    shareholder_proposal:
      "Instrucción general para la agenda de gobernanza (consultiva, no vinculante)",
    shareholder_esg:
      "Solicitud de política ambiental, social o de gobernanza (ej. divulgación climática, DEI)",
    shareholder_exec_comp:
      "Solicitar límites de compensación ejecutiva, políticas de recuperación o divulgación de ratio salarial",
    shareholder_governance:
      "Solicitar cambios de gobernanza como acceso proxy, presidente independiente o votación mayoritaria",
    shareholder_transparency:
      "Solicitar divulgación adicional sobre lobbying, gasto político o cadena de suministro",
    shareholder_rights:
      "Proponer derechos de asamblea especial, consentimiento escrito o derogación anti-adquisición",
    governance:
      "Cambios al marco de gobernanza, reglas de instrucción o umbrales de quórum",
    other: "Cualquier otro asunto para consideración de hodlers",
    community_new_underlying: "Proponer un nuevo activo subyacente para tokenización en NexBridge (ej. 'Quiero exposición a [activo]')",
    community_listing_venue: "Solicitar cotización en un nuevo exchange, banco, broker o integración con una plataforma",
    community_bespoke_product: "Solicitar un instrumento personalizado con parámetros específicos (cesta, cobertura, rendimiento, límites)",
    community_program_features: "Sugerir funciones del portal, informes, notificaciones, UX de acciones corporativas o APIs",
    community_market_structure: "Proponer cambios en la estructura de mercado, reglas de negociación o procesos de liquidación",
    community_transparency: "Solicitar más divulgaciones, formato de prueba de reservas, cadencia de auditoría o claridad en los términos",
    community_other: "Cualquier otro comentario de la comunidad o sugerencia para la plataforma",
  },
};
