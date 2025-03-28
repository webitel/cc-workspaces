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
  },
  appNavigator: {
    title: 'Webitel қосымшасы',
    admin: 'Admin',
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
    callHandled: 'Қоңыраулар өңделді',
    callMissed: 'Қабылданбаған қоңыраулар',
    avgTalk: 'Орташа сөйлесу уақыты',
    avgHold: 'Орташа ұстап тұру уақыты',
    utilization: 'Утилизация',
    occupancy: 'Бос емес',
    chatAccepts: 'Қабылданған чаттар саны',
    chatAht: 'Чатты өңдеудің орташа уақыты',
    scoreCount: 'Бағаланған қоңыраулар',
    scoreAvg: 'Ортақ баға',
  },
  queueSec: {
    call: {
      calls: 'Қоңыраулар',
    },
    chat: {
      chats: 'Чаттар',
    },
    job: {
      jobs: 'Тапсырмалар',
    },
  },
  infoSec: {
    generalInfo: {
      generalInfo: 'Негізгі ақпарат',
      queueWaiting: 'Күтуде',
      queue: 'Кезек | Кезектер',
      agents: 'Операторлар',
      total: 'Барлығы',
      pauses: 'Үзіліс',
      free: 'Бос',
      score: 'Операторды бағалау',
    },
    clientInfo: 'Ақпарат',
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
      },
    },
  },
  workspaceSec: {
    callState: {
      ringing: 'қоңырау шалудамыз',
      hold: 'Ұстап тұру',
      hangup: 'Соңы',
    },
    chat: {
      acceptPreviewText: 'Жауап беруге дайын болсаңыз, «Қабылдау» батырмасын басыңыз',
      draftPlaceholder: 'Хабарлама жазыңыз..',
      dropzone: {
        title: 'Файлдарды осы жерге жылжытып апарыңыз',
        description: 'Оларды жіберу үшін',
      },
      confirmClose: 'Белсенді чатты  жабуға сенімдісіз бе?',
      closedСhat: 'Чат жабылды',
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
  },
  transfer: {
    selectAgent: 'Агентті таңдаңыз',
    transfer: 'Ауыстыру',
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
  error: {
    websocket: {
      [DeviceNotFoundError.id]: 'Микрофон қосылмаған. Әрекетті орындау мүмкін емес.',
      [DeviceNotAllowPermissionError.id]: 'Микрофонды қосу мүмкін емес. Әрекетті орындау мүмкін емес.',
      [LicencePermissionError.id.replaceAll('.', '_')]: 'Workspace жұмыс істеу мүмкін емес. Лицензияның мерзімі аяқталды.',
    },
    endpoint: {
      noLicense: 'Workspace жұмыс істеу мүмкін емес. Лицензияның мерзімі аяқталды.',
    },
  },
  notifications: {
    message: '{name} жіберген жаңа хабарлама',
    userInvite: '{name} жіберген жаңа чат',
    closeConversation: '{name} чаттан шықты',
    [JobState.Distribute]: 'Жаңа тапсырма: {name}',
  },
  emojiPicker: {
    categoriesLabel: 'Санаттар',
    emojiUnsupportedMessage: 'Сіздің браузеріңіз түрлі-түсті эмодзилерді көрсетпейді.',
    favoritesLabel: 'Таңдаулылар',
    loadingMessage: 'Жүктелуде…',
    networkErrorMessage: 'Эмодзи жүктелмеді.',
    searchDescription: 'Іздеу нәтижесі қолжетімді болса, шарлау үшін жоғары немесе төмен батырмасын басыңыз және таңдау үшін еenter басыңыз.',
    searchLabel: 'Іздеу',
    searchResultsLabel: 'Іздеу нәтижесі ',
    skinToneDescription: 'Ашылғаннан кейін шарлау үшін жоғары немесе төмен батырмасын басыңыз және таңдау үшін еnter басыңыз.',
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
      'people -body': 'Адамдар және дене',
      'animals - nature': 'Жануарлар және табиғат',
      'food - drink': 'Ас және сусындар',
      'travel - places': 'Саяхат және орындар',
      activities: 'Іс-шаралар',
      objects: 'Нысандар',
      symbols: 'Таңбалар',
      flags: 'Жалаулар',
    },
  },
  confirmationPopup: {
    title: 'Әрекетті растаңыз',
  },
};
