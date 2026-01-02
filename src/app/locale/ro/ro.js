import {
  AgentStatus,
  DeviceNotAllowPermissionError,
  DeviceNotFoundError,
  JobState,
  LicencePermissionError,
} from 'webitel-sdk';

export default {
  reusable: {
    answer: 'Răspunde',
    reject: 'Respinge',
    accept: 'Acceptă',
    decline: 'Refuză',
    send: 'Trimite',
    save: 'Salvează',
    cancel: 'Anulează',
    close: 'Închide',
    logout: 'Deconectare',
    search: 'Caută',
    description: 'Descriere',
    settings: 'Setări',
    edit: 'Editează',
    select: 'Selectează',
    run: 'Rulează',
    today: 'Astăzi',
    phoneNumber: 'Număr de telefon',
  },
  feedback: {
    success: {
      title: 'Mulțumim!',
      description: 'Răspunsul tău a fost salvat cu succes',
    },
    error: {
      title: 'Ups!',
      description: 'Ceva a mers prost',
    },
  },
  appNavigator: {
    title: 'Aplicații Webitel',
    admin: 'Admin',
    agent: 'Spațiu de lucru Agent',
    supervisor: 'Spațiu de lucru Supervizor',
    audit: 'Audit',
    history: 'Istoric apeluri',
    grafana: 'Grafana',
  },
  header: {
    docs: 'Documente',
    enableVideo: 'Activează video',
    dnd: {
      label: 'Nu deranja',
      tooltip: 'Veți primi apeluri doar din cozi',
    },
  },
  widgets: {
    callInbound: 'Apeluri primite',
    callInboundQueue: 'Apeluri din coada de intrare',
    callDialerQueue: 'Toate apelurile din dialer',
    callManual: 'Apeluri manuale',
    callHandled: 'Apeluri procesate',
    callMissed: 'Apeluri pierdute',
    callQueueMissed: 'Ratate din cozi',
    avgTalk: 'Timp mediu de conversație',
    avgHold: 'Timp mediu de așteptare',
    utilization: 'Utilizare',
    occupancy: 'Ocupare',
    chatAccepts: 'Chat-uri acceptate',
    chatAht: 'Timp de gestionare chat',
    scoreCount: 'Apeluri evaluate',
    scoreAvg: 'Scor total',
    sumTalk: 'Timp total de conversație',
    processing: 'Timp de lucru după apel',
    available: 'Disponibil',
    voiceMail: 'Timp total mesagerie vocală',
    queueTalk: 'Timp de conversație în coadă',
    taskAccepts: 'Cantitate sarcini',
  },
  queueSec: {
    call: {
      call: 'Apel | Apeluri',
      preview: {
        md: {
          active: 'Apeluri active',
          missed: 'Apeluri pierdute',
          offline: 'Apeluri offline',
          manual: 'Apeluri auto-atribuite',
        },
        sm: {
          active: 'Active',
          missed: 'Pierdute',
          offline: 'Offline',
          manual: 'Auto-atribuite',
        },
      },
    },
    chat: {
      chats: 'Chat | Chat-uri',
      preview: {
        md: {
          active: 'Chat-uri active',
          manual: 'Chat-uri auto-atribuite',
          closed: 'Chat-uri închise',
        },
        sm: {
          active: 'Active',
          manual: 'Auto-atribuite',
          closed: 'Închise',
        },
      },
    },
    job: {
      jobs: 'Sarcină | Sarcini',
      preview: {
        md: {
          active: 'Sarcini active',
        },
        sm: {
          active: 'Active',
        },
      },
    },
  },
  infoSec: {
    generalInfo: {
      generalInfo: 'Informații generale',
      queueWaiting: 'În așteptare',
      queue: 'Coadă | Cozi',
      agents: 'Agenți',
      total: 'Total',
      pauses: 'Pauze',
      free: 'Liber',
      score: 'Scor agent',
    },
    clientInfo: 'Informații client',
    memberDescription: 'Descriere membru',
    variables: 'Variabile',
    contacts: {
      client: 'Client',
      manager: 'Proprietar',
      attributes: 'Atribut | Atribute',
      emptyContact: 'Nu s-a găsit niciun contact',
      emptyLabels: 'Nu există etichete',
      emptyAttributes: 'Nu există atribute',
      emptyDescription: 'Nu există descriere',
      foundOneContact: '{ count } contact găsit',
      foundSomeContact: '{ current } din { count } contacte',
      communications: 'Opțiuni de comunicare',
      destination: 'Destinație',
      searchPlaceholder: 'Introduceți criteriile de căutare',
    },
    knowledgeBase: 'Bază de cunoștințe',
    processing: {
      title: 'Procesare sarcini',
      reporting: {
        isSuccess: 'A fost această sarcină un succes?',
        yes: 'Da',
        no: 'Nu',
        nextDistributeAtTitle: 'Programați următoarea sarcină?',
        nextDistributeAt: 'Ora următoarei sarcini',
      },
      form: {
        formFile: {
          deleteConfirmation: 'Sigur doriți să ștergeți acest fișier?',
          empty: 'Nu există încă fișiere',
        },
        formTable: {
          title: 'Tabel',
          error:
            'Datele din tabelul dvs. au un format invalid. Vă rugăm să verificați fluxul.',
        },
      },
    },
    flows: {
      dummy: 'Nu au fost configurate încă scheme',
      runFlowSuccess: 'Schema a fost lansată cu succes',
      runFlowError: 'Eroare la rularea schemei',
    },
  },
  workspaceSec: {
    callState: {
      ringing: 'Sună...',
      hold: 'În așteptare',
      hangup: 'Închide',
    },
    chat: {
      acceptPreviewText:
        'Dacă sunteți gata să răspundeți, faceți clic mai întâi pe butonul "Acceptă"',
      draftPlaceholder: 'Scrieți un mesaj...',
      dropzone: {
        title: 'Trageți fișierele aici',
        description: 'Pentru a le încărca',
      },
      confirmClose: 'Sigur doriți să închideți chat-ul activ?',
      closedСhat: 'Chat-ul a fost închis',
      chatStarted: 'Chat început',
      chatEnded: 'Chat terminat',
      chatTransferred: 'Chat transferat',
      chatsAgent: '{ agentName } s-a alăturat chat-ului',
      chatsAgentsList: '{ agentName } a participat la chat',
      chatsFileBlocked: 'Fișier în carantină sau blocat',
      errors: {
        uploadFileLimitSize: 'Limita de dimensiune a fișierului a fost depășită',
      },
    },
  },
  emptyWorkspace: {
    empty: {
      heading: 'În prezent nu există apeluri sau chat-uri',
      text: 'Vă rugăm să așteptați! Spor la muncă!',
    },
    transfer: {
      heading: 'Mulțumim!',
      text: 'Sarcina a fost transferată către un alt operator',
    },
  },
  emptySearch: {
    heading: 'Ups!',
    text: 'Căutarea nu a dat niciun rezultat',
  },
  bridge: {
    activeCalls: 'Apeluri active',
    bridge: 'Punte',
  },
  history: {
    today: 'Astăzi',
    yesterday: 'Ieri',
    openInHistory: 'Deschide în Istoric',
  },
  transfer: {
    selectAgent: 'Vă rugăm să selectați un agent',
    transfer: 'Transfer',
  },
  contacts: {
    phones: 'Telefon | Telefoane',
    emails: 'Email | Email-uri',
  },
  agentStatus: {
    callCenter: 'Centru de apeluri',
    breakPopup: {
      breakReason: 'Motiv pauză',
      commons: {
        coffeeBreak: 'Pauză de cafea',
        smokeBreak: 'Pauză de fumat',
        restroom: 'Toaletă',
        dinner: 'Cină',
        meeting: 'Întâlnire',
      },
    },
    breakTimer: {
      heading: 'Acum sunteți în modul {mode}',
      mode: {
        [AgentStatus.Pause]: 'pauză',
        [AgentStatus.BreakOut]: 'pauză externă',
      },
      [AgentStatus.BreakOut]: 'Pauză externă',
      continueWork: 'Continuă lucrul',
    },
  },
  disconnectPopup: {
    title: 'Oh.. Ceva nu a mers bine!',
    mainText: 'Conexiunea a fost întreruptă accidental.',
    reloadBtn: 'Reîncarcă pagina',
  },
  welcomePopup: {
    title: 'Bine ați venit la Spațiul de lucru Agent Webitel!',
    subtitle:
      'Vă rugăm să verificați dispozitivele și permisiunile browserului înainte de a începe',
    mic: {
      status: 'Starea permisiunii microfonului',
      message: {
        notFound: 'Microfon negăsit',
        denied: 'Permisiune refuzată',
      },
    },
    notifications: {
      status: 'Starea permisiunii notificărilor',
      message: {
        denied: 'Permisiune refuzată',
      },
    },
    camera: {
      status: 'Starea permisiunii camerei',
      message: {
        denied: 'Permisiune refuzată',
      }
    },
  },
  descTrackAuthPopup: {
    title: 'Atenție',
    errorLabel: 'Nu puteți lucra în Workspace',
    errorDescription: 'DeskTrack nu rulează sau nu sunteți autentificat',
    successLabel: 'DeskTrack a fost lansat cu succes',
    successDescription: 'Puteți lucra în Workspace',
  },
  error: {
    general: 'A apărut o eroare. Vă rugăm să încercați din nou.',
    websocket: {
      [DeviceNotFoundError.id]:
        'Microfonul nu este conectat. Nu se poate efectua acțiunea.',
      [DeviceNotAllowPermissionError.id]:
        'Accesul la microfon este refuzat. Nu se poate efectua acțiunea.',
      [LicencePermissionError.id.replaceAll('.', '_')]:
        'Nu puteți lucra în Spațiul de lucru deoarece licența dvs. a expirat.',
    },
    endpoint: {
      noLicense:
        'Nu puteți lucra în Spațiul de lucru deoarece licența dvs. a expirat.',
    },
  },
  notifications: {
    message: 'Mesaj nou de la {name}',
    userInvite: 'Invitație nouă de chat de la {name}',
    closeConversation: '{name} a părăsit chat-ul',
    [JobState.Distribute]: 'Sarcină nouă: {name}',
    newCall: 'Apel nou',
    closedChatError: 'Eroare la încărcarea chat-urilor închise',
  },
  emojiPicker: {
    categoriesLabel: 'Categorii',
    emojiUnsupportedMessage: 'Browserul dvs. nu acceptă emoji color.',
    favoritesLabel: 'Favorite',
    loadingMessage: 'Se încarcă…',
    networkErrorMessage: 'Nu s-au putut încărca emoji-urile.',
    regionLabel: 'Selector emoji',
    searchDescription:
      'Când rezultatele căutării sunt disponibile, apăsați sus sau jos pentru a selecta și enter pentru a alege.',
    searchLabel: 'Caută',
    searchResultsLabel: 'Rezultatele căutării',
    skinToneDescription:
      'Când este extins, apăsați sus sau jos pentru a selecta și enter pentru a alege.',
    skinToneLabel: 'Alegeți un ton de piele',
    skinTonesLabel: 'Tonuri de piele',
    skinTones: [
      'Implicit',
      'Deschis',
      'Mediu-Deschis',
      'Mediu',
      'Mediu-Închis',
      'Închis',
    ],
    categories: {
      custom: 'Personalizat',
      'smileys-emotion': 'Zâmbete și emoții',
      'people-body': 'Oameni și corp',
      'animals-nature': 'Animale și natură',
      'food-drink': 'Mâncare și băutură',
      'travel-places': 'Călătorii și locuri',
      activities: 'Activități',
      objects: 'Obiecte',
      symbols: 'Simboluri',
      flags: 'Steaguri',
    },
  },
  confirmationPopup: {
    title: 'Confirmă acțiunea',
  },
  autocompleteList: {
    quickReplies: ({ linked }) =>
      `/${linked('objects.quickReplies.quickReplies', 1).toLowerCase()}`,
    quickRepliesDescription: 'Deschide meniul de răspunsuri rapide în chat',
  },
};
