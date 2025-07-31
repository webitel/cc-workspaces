import {
  AgentStatus,
  DeviceNotAllowPermissionError,
  DeviceNotFoundError,
  JobState,
  LicencePermissionError,
} from 'webitel-sdk';

export default {
  reusable: {
    answer: 'Відповісти',
    reject: 'Скинути',
    accept: 'Прийняти',
    decline: 'Відхилити',
    send: 'Надіслати',
    save: 'Зберегти',
    cancel: 'Скасувати',
    close: 'Закрити',
    logout: 'Вийти',
    search: 'Пошук',
    description: 'Опис',
    settings: 'Налаштування',
    edit: 'Редагувати',
    select: 'Обрати',
    run: 'Запустити',
    today: 'Сьогодні',
  },
  appNavigator: {
    title: 'Додатки Webitel',
    admin: 'Admin',
    agent: 'Agent Workspace',
    supervisor: 'Supervisor Workspace',
    audit: 'Audit',
    history: 'Call History',
    grafana: 'Grafana',
  },
  header: {
    docs: 'Документація',
    enableVideo: 'Використовувати відео',
    dnd: {
      label: 'Не турбувати',
      tooltip: 'Ви будете отримувати дзвінки тільки з черг',
    },
  },
  widgets: {
    callInbound: 'Вхідних дзвінків',
    callHandled: 'Опрацьовано дзвінків',
    callMissed: 'Пропущено дзвінків',
    avgTalk: 'Средній час розмови',
    avgHold: 'Средній час утримання',
    utilization: 'Утилізація',
    occupancy: 'Зайнятість',
    chatAccepts: 'Кількість прийнятих чатів',
    chatAht: 'Середній час обробки чату',
    scoreCount: 'Оцінено дзвінків',
    scoreAvg: 'Загальна оцінка',
    sumTalk: 'Загальний час розмови',
    processing: 'Час після закінчення розмови',
    available: 'Доступний',
    voiceMail: 'Загальний час роботи з VM',
    queueTalk: 'Час розмови (вхідна+вихідна)',
    taskAccepts: 'Кількість відпрацьованих задач',
  },
  queueSec: {
    call: {
      call: 'Дзвінок | Дзвінки',
      preview: {
        md: {
          active: 'Активні дзвінки',
          missed: 'Пропущені дзвінки',
          offline: 'Офлайн дзвінки',
          manual: 'Самостійно призначені дзвінки',
        },
        sm: {
          active: 'Активні',
          missed: 'Пропущені',
          offline: 'Офлайн',
          manual: 'Самостійно призначені',
        },
      },
    },
    chat: {
      chats: 'Чат | Чати',
      preview: {
        md: {
          active: 'Активні чати',
          manual: 'Самостійно призначені чати',
          closed: 'Закриті чати',
        },
        sm: {
          active: 'Активні',
          manual: 'Самостійно призначені',
          closed: 'Закриті',
        },
      },
    },
    job: {
      jobs: 'Завдання | Завдання',
      preview: {
        md: {
          active: 'Активні завдання',
        },
        sm: {
          active: 'Активні',
        },
      },
    },
  },
  infoSec: {
    generalInfo: {
      generalInfo: 'Основна інформація',
      queueWaiting: 'Очікують',
      queue: 'Черга | Черги',
      agents: 'Оператори',
      total: 'Всього',
      pauses: 'Паузи',
      free: 'Вільні',
      score: 'Оцінка оператора',
    },
    clientInfo: 'Інформація про клієнта',
    memberDescription: 'Опис учасника',
    variables: 'Змінні',
    contacts: {
      client: 'Клієнт',
      manager: 'Власник',
      attributes: 'Атрибут | Атрибути',
      emptyContact: 'Контакт не знайдено',
      emptyLabels: 'Немає міток',
      emptyAttributes: 'Немає атрибутів',
      emptyDescription: 'Немає опису',
      foundOneContact: 'Знайдено { count } контакт',
      foundSomeContact: '{ current } з { count } контактів',
      communications: 'Варіанти зв\'язку',
      destination: 'Призначення',
      searchPlaceholder: 'Введіть критерії пошуку',
    },
    knowledgeBase: 'База знань',
    processing: {
      title: 'Обробка завдання',
      reporting: {
        isSuccess: 'Чи було це завдання успішним?',
        yes: 'Так',
        no: 'Ні',
        nextDistributeAtTitle: 'Запланувати наступне завдання?',
        nextDistributeAt: 'Час наступного завдання',
      },
      form: {
        formFile: {
          deleteConfirmation: 'Ви впевнені, що хочете видалити цей файл?',
          empty: 'Поки що немає файлів',
        },
        formTable: {
          title: 'Таблиця',
          error: 'Дані вашої таблиці мають невірний формат. Будь ласка, перевірте ваш потік.',
        },
      },
    },
    flows: {
      dummy: 'Схеми ще не налаштовані',
      runFlowSuccess: 'Схему успішно запущено',
      runFlowError: 'Не вдалося запустити схему',
    },
  },
  workspaceSec: {
    callState: {
      ringing: 'Дзвінок..',
      hold: 'Утримання',
      hangup: 'Завершити',
    },
    chat: {
      acceptPreviewText:
        'Якщо ви готові відповідати, спочатку натисніть кнопку "Прийняти"',
      draftPlaceholder: 'Напишіть повідомлення...',
      dropzone: {
        title: 'Перетягніть ваші файли сюди',
        description: 'Щоб завантажити їх',
      },
      confirmClose: 'Ви впевнені, що хочете закрити активний чат?',
      closedСhat: 'Чат було закрито',
      chatStarted: 'Чат розпочато',
      chatEnded: 'Чат завершено',
      chatTransferred: 'Чат передано',
      chatsAgent: '{ agentName } приєднався до чату',
      chatsAgentsList: '{ agentName } брав участь у чаті',
    },
  },
  emptyWorkspace: {
    empty: {
      heading: 'Зараз немає дзвінків або чатів',
      text: 'Будь ласка, зачекайте! Приємної роботи!',
    },
    transfer: {
      heading: 'Дякуємо!',
      text: 'Завдання передано іншому оператору',
    },
  },
  emptySearch: {
    heading: 'Ой!',
    text: 'Пошук не дав жодних результатів',
  },
  bridge: {
    activeCalls: 'Активні дзвінки',
    bridge: 'З\'єднання',
  },
  history: {
    today: 'Сьогодні',
    yesterday: 'Вчора',
    openInHistory: 'Відкрити в історії',
  },
  transfer: {
    selectAgent: 'Будь ласка, виберіть оператора',
    transfer: 'Трансфер',
  },
  contacts: {
    phones: 'Телефон | Телефони',
    emails: 'Email | Email',
  },
  agentStatus: {
    callCenter: 'Call Center',
    breakPopup: {
      breakReason: 'Причина перерви',
      commons: {
        coffeeBreak: 'Перерва на каву',
        smokeBreak: 'Перерва на куріння',
        restroom: 'Туалет',
        dinner: 'Обід',
        meeting: 'Зустріч',
      },
    },
    breakTimer: {
      heading: 'Ви зараз у режимі {mode}',
      mode: {
        [AgentStatus.Pause]: 'перерви',
        [AgentStatus.BreakOut]: 'примусової перерви',
      },
      [AgentStatus.BreakOut]: 'Примусова перерва',
      continueWork: 'Продовжити роботу',
    },
  },
  disconnectPopup: {
    title: 'Ой.. Щось пішло не так!',
    mainText: 'З\'єднання було випадково перервано.',
    reloadBtn: 'Перезавантажити сторінку',
  },
  welcomePopup: {
    title: 'Ласкаво просимо до Webitel Agent Workspace!',
    subtitle: 'Будь ласка, перевірте ваші пристрої та дозволи браузера перед початком',
    mic: {
      status: 'Статус дозволу мікрофону',
      message: {
        notFound: 'Мікрофон не знайдено',
        denied: 'Дозвіл відхилено',
      },
    },
    notifications: {
      status: 'Статус дозволу сповіщень',
      message: {
        denied: 'Дозвіл відхилено',
      },
    },
  },
  error: {
    general: 'Сталася помилка. Будь ласка, спробуйте ще раз.',
    websocket: {
      [DeviceNotFoundError.id]:
        'Мікрофон не підключено. Неможливо виконати дію.',
      [DeviceNotAllowPermissionError.id]:
        'Доступ до мікрофону заборонено. Неможливо виконати дію.',
      [LicencePermissionError.id.replaceAll('.', '_')]:
        'Ви не можете працювати в Workspace, оскільки ваша ліцензія закінчилася.',
    },
    endpoint: {
      noLicense:
        'Ви не можете працювати в Workspace, оскільки ваша ліцензія закінчилася.',
    },
  },
  notifications: {
    message: 'Нове повідомлення від {name}',
    userInvite: 'Нове запрошення в чат від {name}',
    closeConversation: '{name} покинув чат',
    [JobState.Distribute]: 'Нове завдання: {name}',
    newCall: 'Новий дзвінок',
    closedChatError: 'Не вдалося завантажити закриті чати',
  },
  emojiPicker: {
    categoriesLabel: 'Категорії',
    emojiUnsupportedMessage: 'Ваш браузер не підтримує кольорові емодзі.',
    favoritesLabel: 'Улюблені',
    loadingMessage: 'Завантаження…',
    networkErrorMessage: 'Не вдалося завантажити емодзі.',
    regionLabel: 'Вибір емодзі',
    searchDescription:
      'Коли результати пошуку доступні, натисніть вгору або вниз для вибору та Enter для підтвердження.',
    searchLabel: 'Пошук',
    searchResultsLabel: 'Результати пошуку',
    skinToneDescription:
      'Коли розгорнуто, натисніть вгору або вниз для вибору та Enter для підтвердження.',
    skinToneLabel: 'Виберіть тон шкіри',
    skinTonesLabel: 'Тони шкіри',
    skinTones: [
      'За замовчуванням',
      'Світлий',
      'Середньо-світлий',
      'Середній',
      'Середньо-темний',
      'Темний',
    ],
    categories: {
      custom: 'Власні',
      'smileys-emotion': 'Смайлики та емоції',
      'people-body': 'Люди та тіло',
      'animals-nature': 'Тварини та природа',
      'food-drink': 'Їжа та напої',
      'travel-places': 'Подорожі та місця',
      activities: 'Діяльність',
      objects: 'Об\'єкти',
      symbols: 'Символи',
      flags: 'Прапори',
    },
  },
  confirmationPopup: {
    title: 'Підтвердити дію',
  },
  autocompleteList: {
    quickReplies: ({ linked }) => `/${linked('objects.quickReplies.quickReplies', 1).toLowerCase()}`,
    quickRepliesDescription: 'Відкриває меню швидких відповідей в чаті'
  }
};
