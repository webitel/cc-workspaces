import {
  AgentStatus,
  DeviceNotAllowPermissionError,
  DeviceNotFoundError,
  JobState,
  LicencePermissionError,
} from 'webitel-sdk';

export default {
  reusable: {
    answer: 'Javob berish',
    reject: 'Rad etish',
    accept: 'Qabul qilish',
    decline: 'Rad etish',
    send: 'Yuborish',
    save: 'Saqlash',
    cancel: 'Bekor qilish',
    close: 'Yopish',
    logout: 'Chiqish',
    search: 'Qidirish',
    description: 'Tavsif',
    settings: 'Sozlamalar',
    edit: 'Tahrirlash',
    select: 'Tanlash',
    run: 'Ishga tushirish',
    today: 'Bugun',
  },
  appNavigator: {
    title: 'Webitel ilovalari',
    admin: 'Admin',
    agent: 'Agent Ish joyi',
    supervisor: 'Supervisor Ish joyi',
    audit: 'Audit',
    history: 'Qo‘ng‘iroqlar tarixi',
    grafana: 'Grafana',
  },
  header: {
    docs: 'Hujjatlar',
    enableVideo: 'Videoni yoqish',
    dnd: {
      label: 'Bezovta qilmaslik',
      tooltip: 'Siz faqat navbatlardan qo‘ng‘iroqlarni qabul qilasiz',
    },
  },
  widgets: {
    callInbound: 'Kirish qo‘ng‘iroqlari',
    callHandled: 'Qabul qilingan qo‘ng‘iroqlar',
    callMissed: 'O‘tkazib yuborilgan qo‘ng‘iroqlar',
    avgTalk: 'O‘rtacha suhbat vaqti',
    avgHold: 'O‘rtacha kutish vaqti',
    utilization: 'Foydalanish',
    occupancy: 'Bandlik',
    chatAccepts: 'Qabul qilingan chatlar',
    chatAht: 'Chatni qayta ishlash vaqti',
    scoreCount: 'Baholangan qo‘ng‘iroqlar',
    scoreAvg: 'Umumiy baho',
    sumTalk: 'Umumiy suhbat vaqti',
    processing: 'Qo‘ng‘iroqdan keyingi ish vaqti',
    available: 'Mavjud',
    voiceMail: 'Umumiy VM vaqti',
    queueTalk: 'Navbatdagi suhbat vaqti',
    taskAccepts: 'Vazifalar soni',
  },
  queueSec: {
    call: {
      call: 'Qo‘ng‘iroq | Qo‘ng‘iroqlar',
      preview: {
        md: {
          active: 'Faol qo‘ng‘iroqlar',
          missed: 'O‘tkazib yuborilgan qo‘ng‘iroqlar',
          offline: 'Oflayn qo‘ng‘iroqlar',
          manual: 'Qo‘lda tayinlangan qo‘ng‘iroqlar',
        },
        sm: {
          active: 'Faol',
          missed: 'O‘tkazib yuborilgan',
          offline: 'Oflayn',
          manual: 'Qo‘lda tayinlangan',
        },
      },
    },
    chat: {
      chats: 'Chat | Chatlar',
      preview: {
        md: {
          active: 'Faol chatlar',
          manual: 'Qo‘lda tayinlangan chatlar',
          closed: 'Yopilgan chatlar',
        },
        sm: {
          active: 'Faol',
          manual: 'Qo‘lda tayinlangan',
          closed: 'Yopilgan',
        },
      },
    },
    job: {
      jobs: 'Vazifa | Vazifalar',
      preview: {
        md: {
          active: 'Faol vazifalar',
        },
        sm: {
          active: 'Faol',
        },
      },
    },
  },
  infoSec: {
    generalInfo: {
      generalInfo: 'Umumiy maʼlumot',
      queueWaiting: 'Kutilmoqda',
      queue: 'Navbat | Navbatlar',
      agents: 'Agentlar',
      total: 'Jami',
      pauses: 'Tanaffuslar',
      free: 'Boʻsh',
      score: 'Agent bahosi',
    },
    clientInfo: 'Mijoz maʼlumoti',
    memberDescription: 'Aʼzo tavsifi',
    variables: 'Oʻzgaruvchilar',
    contacts: {
      client: 'Mijoz',
      manager: 'Egas',
      attributes: 'Atribut | Atributlar',
      emptyContact: 'Aloqa topilmadi',
      emptyLabels: 'Yorliqlar yoʻq',
      emptyAttributes: 'Atributlar yoʻq',
      emptyDescription: 'Tavsif yoʻq',
      foundOneContact: '{ count } aloqa topildi',
      foundSomeContact: '{ current } / { count } aloqa',
      communications: 'Aloqa variantlari',
      destination: 'Manzil',
      searchPlaceholder: 'Qidiruv mezonlarini kiriting',
    },
    knowledgeBase: 'Bilimlar bazasi',
    processing: {
      title: 'Vazifani qayta ishlash',
      reporting: {
        isSuccess: 'Vazifa muvaffaqiyatli bajarildimi?',
        yes: 'Ha',
        no: 'Yoʻq',
        nextDistributeAtTitle: 'Keyingi vazifani rejalashtirasizmi?',
        nextDistributeAt: 'Keyingi vazifa vaqti',
      },
      form: {
        formFile: {
          deleteConfirmation: 'Ushbu faylni oʻchirishga ishonchingiz komilmi?',
          empty: 'Hozircha fayllar yoʻq',
        },
        formTable: {
          title: 'Jadval',
          error: 'Jadval maʼlumotlari notoʻgʻri formatda. Iltimos, oqimni tekshiring.',
        },
      },
    },
    flows: {
      dummy: 'Hali hech qanday sxema sozlanmagan',
      runFlowSuccess: 'Sxema muvaffaqiyatli ishga tushirildi',
      runFlowError: 'Sxemani ishga tushirib boʻlmadi',
    },
  },
  workspaceSec: {
    callState: {
      ringing: 'Qoʻngʻiroq qilinmoqda...',
      hold: 'Kutish',
      hangup: 'Tugatish',
    },
    chat: {
      acceptPreviewText: 'Agar javob berishga tayyor boʻlsangiz, avval "Qabul qilish" tugmasini bosing',
      draftPlaceholder: 'Xabar yozing...',
      dropzone: {
        title: 'Fayllarni shu yerga tashlang',
        description: 'Yuklash uchun',
      },
      confirmClose: 'Faol chatni yopmoqchimisiz?',
      closedСhat: 'Chat yopildi',
      chatStarted: 'Chat boshlandi',
      chatEnded: 'Chat tugadi',
      chatTransferred: 'Chat oʻtkazildi',
      chatsAgent: '{ agentName } chatga qoʻshildi',
      chatsAgentsList: '{ agentName } chatda ishtirok etdi',
    },
  },
  emptyWorkspace: {
    empty: {
      heading: 'Hozircha qoʻngʻiroq yoki chat yoʻq',
      text: 'Iltimos, kuting! Yaxshi ishlar!',
    },
    transfer: {
      heading: 'Rahmat!',
      text: 'Vazifa boshqa agentga oʻtkazildi',
    },
  },
  emptySearch: {
    heading: 'Oops!',
    text: 'Qidiruv natija bermadi',
  },
  bridge: {
    activeCalls: 'Faol qoʻngʻiroqlar',
    bridge: 'Koʻprik',
  },
  history: {
    today: 'Bugun',
    yesterday: 'Kecha',
    openInHistory: 'Tarixda ochish',
  },
  transfer: {
    selectAgent: 'Iltimos, agentni tanlang',
    transfer: 'Oʻtkazish',
  },
  contacts: {
    phones: 'Telefon | Telefonlar',
    emails: 'Email | Email-lar',
  },
  agentStatus: {
    callCenter: 'Call Center',
    breakPopup: {
      breakReason: 'Tanaffus sababi',
      commons: {
        coffeeBreak: 'Kofe tanaffusi',
        smokeBreak: 'Chekish tanaffusi',
        restroom: 'Hojatxona',
        dinner: 'Tushlik',
        meeting: 'Uchrashuv',
      },
    },
    breakTimer: {
      heading: 'Siz hozir {mode} rejimidasiz',
      mode: {
        [AgentStatus.Pause]: 'tanaffus',
        [AgentStatus.BreakOut]: 'majburiy tanaffus',
      },
      [AgentStatus.BreakOut]: 'Majburiy tanaffus',
      continueWork: 'Ishni davom ettirish',
    },
  },
  disconnectPopup: {
    title: 'Nimadir notoʻgʻri ketdi!',
    mainText: 'Aloqa uzildi.',
    reloadBtn: 'Sahifani yangilang',
  },
  welcomePopup: {
    title: 'Webitel Agent Workspace ga xush kelibsiz!',
    subtitle: 'Boshlashdan oldin qurilmalar va brauzer ruxsatlarini tekshiring',
    mic: {
      status: 'Mikrofon ruxsat holati',
      message: {
        notFound: 'Mikrofon topilmadi',
        denied: 'Ruxsat berilmadi',
      },
    },
    notifications: {
      status: 'Bildirishnoma ruxsat holati',
      message: {
        denied: 'Ruxsat berilmadi',
      },
    },
  },
  error: {
    general: 'Xatolik yuz berdi. Qayta urinib koʻring.',
    websocket: {
      [DeviceNotFoundError.id]: 'Mikrofon ulanmagan. Amalni bajarib boʻlmaydi.',
      [DeviceNotAllowPermissionError.id]: 'Mikrofonga ruxsat yoʻq. Amalni bajarib boʻlmaydi.',
      [LicencePermissionError.id.replaceAll('.', '_')]: 'Workspace ishlamaydi. Litsenziya muddati tugagan.',
    },
    endpoint: {
      noLicense: 'Workspace ishlamaydi. Litsenziya muddati tugagan.',
    },
  },
  notifications: {
    message: '{name} dan yangi xabar',
    userInvite: '{name} dan yangi chat',
    closeConversation: '{name} chatdan chiqdi',
    [JobState.Distribute]: 'Yangi vazifa: {name}',
    newCall: 'Yangi qoʻngʻiroq',
    closedChatError: 'Yopiq chatlarni yuklab boʻlmadi',
  },
  emojiPicker: {
    categoriesLabel: 'Kategoriyalar',
    emojiUnsupportedMessage: 'Brauzeringiz rangli emoji ni koʻrsatmaydi.',
    favoritesLabel: 'Sevimlilar',
    loadingMessage: 'Yuklanmoqda…',
    networkErrorMessage: 'Emoji yuklab boʻlmadi.',
    regionLabel: 'Emoji tanlovchi',
    searchDescription: 'Qidiruv natijalari mavjud boʻlsa, yuqoriga yoki pastga bosing va tanlash uchun enter ni bosing.',
    searchLabel: 'Qidirish',
    searchResultsLabel: 'Qidiruv natijalari',
    skinToneDescription: 'Kengaytirilganda, yuqoriga yoki pastga bosing va tanlash uchun enter ni bosing.',
    skinToneLabel: 'Teri rangini tanlang',
    skinTonesLabel: 'Teri ranglari',
    skinTones: [
      'Standart',
      'Och',
      'Oʻrtacha och',
      'Oʻrtacha',
      'Oʻrtacha toʻq',
      'Toʻq',
    ],
    categories: {
      custom: 'Maxsus',
      'smileys-emotion': 'Smaylik va emotsiyalar',
      'people-body': 'Odamlar va tana',
      'animals-nature': 'Hayvonlar va tabiat',
      'food-drink': 'Oziq-ovqat va ichimliklar',
      'travel-places': 'Sayohat va joylar',
      activities: 'Faoliyatlar',
      objects: 'Obyektlar',
      symbols: 'Belgilar',
      flags: 'Bayroqlar',
    },
  },
  confirmationPopup: {
    title: 'Harakatni tasdiqlang',
  },
  autocompleteList: {
    quickReplies: ({ linked }) => `/${linked('objects.quickReplies.quickReplies', 1).toLowerCase()}`,
    quickRepliesDescription: 'Chatda tezkor javoblar menyusini ochadi'
  }
};

