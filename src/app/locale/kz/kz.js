import {
  DeviceNotFoundError,
  DeviceNotAllowPermissionError,
  LicencePermissionError,
  JobState,
  AgentStatus,
} from 'webitel-sdk';

export default {
  reusable: {
    answer: 'Жауап юеру',
    reject: 'Қалпына келтіру',
    accept: 'Қабылдау',
    decline: 'Қабылдамау',
    send: 'Жіберу',
    save: 'Сақтау',
    cancel: 'Болдырмау',
    close: 'Жабу',
    logout: 'Шағу',
    search: 'Іздеу',
    description: 'Сипаттама',
    settings: 'Параметрлер',
    edit: 'Өңдеу',
  },
  appNavigator: {
    title: 'Webitel қолданбалары',
    admin: 'Admin',
  },
  header: {
    docs: 'Құжаттама',
    enableVideo: 'Бейнені пайдалау',
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
    avgHold: 'Орташа сақтау уақыты',
    utilization: 'Жою',
    occupancy: 'Бос емес',
    chatAccepts: 'Қабылданған чаттар саны',
    chatAht: 'Чатты өңдеудің орташа уақыты',
    scoreCount: 'Бағаланған қоңыраулар',
    scoreAvg: 'Жалпы баға',
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
      total: 'Барлық',
      pauses: 'Кідіртулер',
      free: 'Бос',
      score: 'Оператор бағасы',
    },
    clientInfo: 'Ақпарат',
    knowledgeBase: 'Білім базасы',
    processing: {
      title: 'Тапсырманы өңдеу',
      reporting: {
        isSuccess: 'Тапсырма сәтті болды ма?',
        yes: 'Иә',
        no: 'Жоқ',
        nextDistributeAtTitle: 'Келесі тапсырмаңызды жоспарлаңыз ба?',
        nextDistributeAt: 'Келесі тапсырма уақыты',
      },
      form: {
        formFile: {
          deleteConfirmation: 'Бұл файлды шынымен жойғыңыз келе ме?',
          empty: 'Бұл жерде әлі файлдар жоқ',
        },
      },
    },
  },
  workspaceSec: {
    callState: {
      ringing: 'звондап жатырмын..',
      hold: 'Ұстаңыз',
      hangup: 'Соңы',
    },
    chat: {
      acceptPreviewText: 'Жауап беруге дайын болсаңыз, «Қабылдау» түймесін басыңыз',
      draftPlaceholder: 'Хабарлама жазу...',
      dropzone: {
        title: 'Файлдарды осы жерге жылжытыңыз',
        description: 'Оларды жіберу үшін',
      },
      confirmClose: 'Белсенді чатты шынымен жапқыңыз келе ме?',
      closedСhat: 'Чат жабылды',
    },
  },
  emptyWorkspace: {
    empty: {
      heading: 'Дәл қазір жаңа қоңыраулар немесе чаттар жоқ',
      text: 'Өтінемін, күте тұрыңыз! Күніңіз жақсы өтсін!',
    },
    transfer: {
      heading: 'Рақмет!',
      text: 'Тапсырма басқа операторға берілді',
    },
  },
  emptySearch: {
    heading: 'Ой!',
    text: 'Іздеу еш нәтиже бермеді',
  },
  bridge: {
    activeCalls: 'Белсенді қоңыраулар',
    bridge: 'Қосылу',
  },
  history: {
    today: 'Бүгін',
    yesterday: 'Кеше',
  },
  transfer: {
    selectAgent: 'Агентті таңдаңыз',
    transfer: 'Аудару',
  },
  agentStatus: {
    callCenter: 'Call-орталығы',
    breakPopup: {
      breakReason: 'Үзіліс себебі',
      commons: {
        coffeeBreak: 'Кофе',
        smokeBreak: 'Үзілісі',
        restroom: 'дәретхана',
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
    subtitle: 'Бастамас бұрын құрылғылар мен браузер параметрлерін тексеріңіз.',
    mic: {
      status: 'Микрофонды пайдалануға рұқсат',
      message: {
        notFound: 'Микрофон табылмады',
        denied: 'Тыйым салынған',
      },
    },
    notifications: {
      status: 'Ескертулерді алуға рұқсат',
      message: {
        denied: 'Тыйым салынған',
      },
    },
  },
  error: {
    websocket: {
      [DeviceNotFoundError.id]: 'Микрофон қосылмаған. Әрекетті орындау мүмкін емес.',
      [DeviceNotAllowPermissionError.id]: 'Микрофонға кіру мүмкіндігі жоқ. Әрекетті орындау мүмкін емес.',
      [LicencePermissionError.id.replaceAll('.', '_')]: 'Workspace жұмыс істеу мүмкін емес. Лицензияның мерзімі бітті.',
    },
    endpoint: {
      noLicense: 'Workspace жұмыс істеу мүмкін емес. Лицензияның мерзімі бітті.',
    },
  },
  notifications: {
    message: '{name} жіберген жаңа хабар',
    userInvite: '{name} жаңа чат',
    closeConversation: '{name} чаттан шықты',
    [JobState.Distribute]: 'Жаңа тапсырма: {name}',
  },
  emojiPicker: {
    categoriesLabel: 'Санаттар',
    emojiUnsupportedMessage: 'Браузеріңіз түсті эмодзилерге қолдау көрсетпейді.',
    favoritesLabel: 'Таңдаулылар',
    loadingMessage: 'Жүктелуде…',
    networkErrorMessage: 'Эмодзи жүктелмеді.',
    searchDescription: 'Іздеу нәтижесі қолжетімді болса, шарлау үшін жоғары немесе төмен түймесін басыңыз және таңдау үшін еenter басыңыз.',
    searchLabel: 'Іздеу',
    searchResultsLabel: 'Іздеу нәтижесі ',
    skinToneDescription: 'Ашылғаннан кейін шарлау үшін жоғары немесе төмен түймесін басыңыз және таңдау үшін еnter басыңыз.',
    skinToneLabel: 'Тері түсін таңдаңыз',
    skinTonesLabel: 'Тері түсі',
    skinTones: [
      'Әдепкі',
      'Жарық',
      'Орташа жарық',
      'Орташа',
      'Орташа қараңғы',
      'Қараңғы',
    ],
    categories: {
      custom: 'Менікі',
      'smileys-emotion': 'Смайл мен смайликтер',
      'people -body': 'Адамдар және дене',
      'animals - nature': 'Жануарлар және табиғат',
      'food - drink': 'Тамақ және сусын',
      'travel - places': 'Саяхат және орындар',
      activities: 'Іс-шаралар',
      objects: 'Объектілер',
      symbols: 'Рәміздер',
      flags: 'Жалаулар',
    },
  },
  confirmationPopup: {
    title: 'Әрекетті растау',
  },
};
