import {
  AgentStatus,
  DeviceNotAllowPermissionError,
  DeviceNotFoundError,
  JobState,
  LicencePermissionError,
} from 'webitel-sdk';

export default {
  reusable: {
    answer: 'Жауап беру',
    reject: 'Қалпына келтіру',
    accept: 'Қабылдау',
    decline: 'Қабылдамау',
    send: 'Жіберу',
    save: 'Сақтау',
    cancel: 'Бас тарту ',
    close: 'Жабу',
    logout: 'Шығу',
    search: 'Іздеу',
    description: 'Сипаттама',
    settings: 'Баптау',
    edit: 'Редакциялау',
    select: 'Таңдау',
    run: 'Іске қосу',
    today: 'Бүгін',
    phoneNumber: 'Телефон нөмірі',
  },
  feedback: {
    success: {
      title: 'Рақмет!',
      description: 'Жауабыңыз сәтті сақталды',
    },
    error: {
      title: 'Қате!',
      description: 'Бір нәрсе дұрыс болмады',
    },
  },
  appNavigator: {
    title: 'Webitel қосымшасы',
    admin: 'Admin',
    agent: 'Оператор жұмыс орны',
    supervisor: 'Супервизор жұмыс орны',
    audit: 'Аудит',
    history: 'Қоңыраулар тарихы',
    grafana: 'Grafana',
  },
  header: {
    docs: 'Құжаттама',
    enableVideo: 'Бейнені пайдалану',
    dnd: {
      label: 'Мазаламаңыз',
      tooltip: 'Сіз тек кезектердегі қоңырауларды қабылдайсыз',
    },
  },
  widgets: {
    callInbound: 'Кіріс қоңыраулар',
    callInboundQueue: 'Кіру кезегінен қоңыраулар',
    callDialerQueue: 'Дайлерден барлық қоңыраулар',
    callManual: 'Қолмен қоңыраулар',
    callHandled: 'Қоңыраулар өңделді',
    callMissed: 'Қабылданбаған қоңыраулар',
    callQueueMissed: 'Кезектен жіберілген қоңыраулар',
    avgTalk: 'Орташа сөйлесу уақыты',
    avgHold: 'Орташа ұстап тұру уақыты',
    utilization: 'Утилизация',
    occupancy: 'Бос емес',
    chatAccepts: 'Қабылданған чаттар саны',
    chatAht: 'Чатты өңдеудің орташа уақыты',
    scoreCount: 'Бағаланған қоңыраулар',
    scoreAvg: 'Ортақ баға',
    sumTalk: 'Жалпы сөйлесу уақыты',
    processing: 'Қоңыраудан кейінгі өңдеу уақыты',
    available: 'Қол жетімді',
    voiceMail: 'Дауыстық пошта уақыты',
    queueTalk: 'Кезектегі сөйлесу уақыты',
    taskAccepts: 'Тапсырмалар саны',
  },
  queueSec: {
    call: {
      call: 'Қоңырау | Қоңыраулар',
      preview: {
        md: {
          active: 'Белсенді қоңыраулар',
          missed: 'Қабылданбаған қоңыраулар',
          offline: 'Офлайн қоңыраулар',
          manual: 'Өзіне тағайындалған қоңыраулар',
        },
        sm: {
          active: 'Белсенді',
          missed: 'Қабылданбаған',
          offline: 'Офлайн',
          manual: 'Өзіне тағайындалған',
        },
      },
    },
    chat: {
      chats: 'Чат | Чаттар',
      preview: {
        md: {
          active: 'Белсенді чаттар',
          manual: 'Өзіне тағайындалған чаттар',
          closed: 'Жабық чаттар',
        },
        sm: {
          active: 'Белсенді',
          manual: 'Өзіне тағайындалған',
          closed: 'Жабық',
        },
      },
    },
    job: {
      jobs: 'Тапсырма | Тапсырмалар',
      preview: {
        md: {
          active: 'Белсенді тапсырмалар',
        },
        sm: {
          active: 'Белсенді',
        },
      },
    },
  },
  infoSec: {
    generalInfo: {
      generalInfo: 'Жалпы ақпарат',
      queueWaiting: 'Күтуде',
      queue: 'Кезек | Кезектер',
      agents: 'Операторлар',
      total: 'Барлығы',
      pauses: 'Үзіліс',
      free: 'Бос',
      score: 'Операторды бағалау',
    },
    clientInfo: 'Ақпарат',
    memberDescription: 'Мүшенің сипаттамасы', // TODO: Translate
    variables: 'Айнымалылар', // TODO: Translate
    contacts: {
      client: 'Клиент',
      manager: 'Иесі', // TODO: Translate
      attributes: 'Атрибут | Атрибуттар',
      emptyContact: 'Байланыс табылмады',
      emptyLabels: 'Жапсырмалар жоқ',
      emptyAttributes: 'Атрибуттар жоқ',
      emptyDescription: 'Сипаттама жоқ',
      foundOneContact: '{ count } байланыс табылды',
      foundSomeContact: '{ current } / { count } байланыс',
      communications: 'Байланыс опциялары',
      destination: 'Мақсат',
      searchPlaceholder: 'Іздеу критерийлерін енгізіңіз',
    },
    knowledgeBase: 'Білім қоры',
    processing: {
      title: 'Тапсырманы өңдеу',
      reporting: {
        isSuccess: 'Тапсырма сәтті болды ма?',
        yes: 'Иә',
        no: 'Жоқ',
        nextDistributeAtTitle: 'Келесі тапсырманы жоспарлайсыз ба?',
        nextDistributeAt: 'Келесі тапсырманың уақыты',
      },
      form: {
        formFile: {
          deleteConfirmation: 'Бұл файлды  жойғыңыз келетініне сенімдісіз бе?',
          empty: 'Бұл жерде әзірге файлдар жоқ',
        },
        formTable: {
          title: 'Кесте',
          error: 'Кесте деректерінің форматы дұрыс емес. Ағымды тексеріңіз.',
        },
      },
    },
    flows: {
      dummy: 'Схемалар әлі конфигурацияланбаған',
      runFlowSuccess: 'Схема сәтті іске қосылды',
      runFlowError: 'Схеманы іске қосу сәтсіз аяқталды',
    },
  },
  workspaceSec: {
    callState: {
      ringing: 'Қоңырау шалу',
      inCall: 'Сөйлесуде',
      onHold: 'Ұстап тұру',
      hangup: 'Соңы',
    },
    chat: {
      acceptPreviewText:
        'Жауап беруге дайын болсаңыз, «Қабылдау» батырмасын басыңыз',
      draftPlaceholder: 'Хабарлама жазыңыз..',
      dropzone: {
        title: 'Файлдарды осы жерге жылжытып апарыңыз',
        description: 'Оларды жіберу үшін',
      },
      confirmClose: 'Белсенді чатты  жабуға сенімдісіз бе?',
      closedСhat: 'Чат жабылды',
      chatStarted: 'Чат басталды', // TODO: Translate
      chatEnded: 'Чат аяқталды', // TODO: Translate
      chatTransferred: 'Чат ауыстырылды', // TODO: Translate
      chatsAgent: '{ agentName } чатқа қосылды', // TODO: Translate
      chatsAgentsList: '{ agentName } чатқа қатысты', // TODO: Translate
      chatsFileBlocked: 'Файл карантинде немесе бұғатталған',
      errors: {
        uploadFileLimitSize: 'Файл өлшемі шегінен асты',
      },
    },
  },
  emptyWorkspace: {
    empty: {
      heading: 'Қазір жаңа қоңыраулар немесе чаттар жоқ',
      text: 'Өтінемін, күте тұрыңыз! Күніңіз жақсы өтсін!',
    },
    transfer: {
      heading: 'Рақмет!',
      text: 'Тапсырма басқа операторға берілді',
    },
  },
  emptySearch: {
    heading: 'Йоой!',
    text: 'Іздеу еш нәтиже бермеді',
  },
  bridge: {
    activeCalls: 'Белсенді қоңыраулар',
    bridge: 'Қосу',
  },
  history: {
    today: 'Бүгін',
    yesterday: 'Кеше',
    openInHistory: 'Тарихта ашу',
  },
  transfer: {
    selectAgent: 'Агентті таңдаңыз',
    transfer: 'Ауыстыру',
  },
  contacts: {
    phones: 'Телефон | Телефондар',
    emails: 'Email | Email-дар',
  },
  agentStatus: {
    callCenter: 'Байланыс орталығы',
    breakPopup: {
      breakReason: 'Үзіліс себебі',
      commons: {
        coffeeBreak: 'Кофе',
        smokeBreak: 'Үзіліс',
        restroom: 'WC',
        dinner: 'Түскі ас',
        meeting: 'Жиналыс',
      },
    },
    breakTimer: {
      heading: 'Сіз {mode} режиміндесіз',
      mode: {
        [AgentStatus.Pause]: 'үзілістер',
        [AgentStatus.BreakOut]: 'мәжбүрлі үзілістер',
      },
      [AgentStatus.BreakOut]: 'мәжбүрлі үзіліс',
      continueWork: 'Жұмысты жалғастыру',
    },
  },
  disconnectPopup: {
    title: 'Ой... Бірдеңе дұрыс болмады!',
    mainText: 'Байланыс жоғалды.',
    reloadBtn: 'Бетті жаңартыңыз',
  },
  welcomePopup: {
    title: 'Webitel Agent Workspace қош келдіңіз!',
    subtitle: 'Бастамас бұрын құрылғылар мен браузер баптауды тексеріңіз.',
    mic: {
      status: 'Микрофонды пайдалануға рұқсат',
      message: {
        notFound: 'Микрофон табылмады',
        denied: 'Тыйым салынған',
      },
    },
    notifications: {
      status: 'Хабарламаларды алуға рұқсат',
      message: {
        denied: 'Тыйым салынған',
      },
    },
  },
  descTrackAuthPopup: {
    title: 'Назар аударыңыз',
    errorLabel: 'Сіз Workspace-те жұмыс істей алмайсыз',
    errorDescription: 'DeskTrack іске қосылмаған немесе сіз жүйеге кірмедіңіз',
    successLabel: 'DeskTrack сәтті іске қосылды',
    successDescription: 'Сіз Workspace-те жұмыс істей аласыз',
  },
  error: {
    general: 'Қате орын алды. Қайталап көріңіз.', // TODO: Translate
    websocket: {
      [DeviceNotFoundError.id]:
        'Микрофон қосылмаған. Әрекетті орындау мүмкін емес.',
      [DeviceNotAllowPermissionError.id]:
        'Микрофонды қосу мүмкін емес. Әрекетті орындау мүмкін емес.',
      [LicencePermissionError.id.replaceAll('.', '_')]:
        'Workspace жұмыс істеу мүмкін емес. Лицензияның мерзімі аяқталды.',
    },
    endpoint: {
      noLicense:
        'Workspace жұмыс істеу мүмкін емес. Лицензияның мерзімі аяқталды.',
    },
  },
  notifications: {
    message: '{name} жіберген жаңа хабарлама',
    userInvite: '{name} жіберген жаңа чат',
    closeConversation: '{name} чаттан шықты',
    [JobState.Distribute]: 'Жаңа тапсырма: {name}',
    newCall: 'Жаңа қоңырау', // TODO: Translate
    closedChatError: 'Жабық чаттарды жүктеу сәтсіз аяқталды', // TODO: Translate
  },
  emojiPicker: {
    categoriesLabel: 'Санаттар',
    emojiUnsupportedMessage:
      'Сіздің браузеріңіз түрлі-түсті эмодзилерді көрсетпейді.',
    favoritesLabel: 'Таңдаулылар',
    loadingMessage: 'Жүктелуде…',
    networkErrorMessage: 'Эмодзи жүктелмеді.',
    regionLabel: 'Эмодзи таңдаушы', // TODO: Translate
    searchDescription:
      'Іздеу нәтижесі қолжетімді болса, шарлау үшін жоғары немесе төмен батырмасын басыңыз және таңдау үшін еenter басыңыз.',
    searchLabel: 'Іздеу',
    searchResultsLabel: 'Іздеу нәтижесі ',
    skinToneDescription:
      'Ашылғаннан кейін шарлау үшін жоғары немесе төмен батырмасын басыңыз және таңдау үшін еnter басыңыз.',
    skinToneLabel: 'Терінің түсін таңдаңыз',
    skinTonesLabel: 'Терінің түсі',
    skinTones: [
      'Ұйғарым бойынша ',
      'Ақшыл',
      'Орташа ақшыл',
      'Орташа',
      'Орташа қара',
      'Қара',
    ],
    categories: {
      custom: 'Өз',
      'smileys-emotion': 'Смайл мен смайлдар',
      'people-body': 'Адамдар және дене',
      'animals-nature': 'Жануарлар және табиғат',
      'food-drink': 'Ас және сусындар',
      'travel-places': 'Саяхат және орындар',
      activities: 'Іс-шаралар',
      objects: 'Нысандар',
      symbols: 'Таңбалар',
      flags: 'Жалаулар',
    },
  },
  confirmationPopup: {
    title: 'Әрекетті растаңыз',
  },
  autocompleteList: {
    quickReplies: ({ linked }) =>
      `/${linked('objects.quickReplies.quickReplies', 1).toLowerCase()}`,
    quickRepliesDescription: 'Чаттағы жылдам жауаптар мәзірін ашады',
  },
};
