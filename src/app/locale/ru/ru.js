import {
  AgentStatus,
  DeviceNotAllowPermissionError,
  DeviceNotFoundError, JobState, LicencePermissionError,
} from 'webitel-sdk';

export default {
  reusable: {
    answer: 'Ответить',
    reject: 'Сбросить',
    accept: 'Принять',
    decline: 'Отклонить',
    send: 'Отправить',
    save: 'Сохранить',
    cancel: 'Отменить',
    close: 'Закрыть',
    logout: 'Выйти',
    search: 'Поиск',
    description: 'Описание',
    settings: 'Настройки',
    edit: 'Редактировать',
    select: 'Выбрать',
  },
  appNavigator: {
    title: 'Приложения Webitel',
    admin: 'Admin',
    agent: 'Agent Workspace',
    supervisor: 'Supervisor Workspace',
    audit: 'Audit',
    history: 'Call History',
    grafana: 'Grafana',
  },
  header: {
    docs: 'Документация',
    enableVideo: 'Использовать видео',
    dnd: {
      label: 'Не беспокоить',
      tooltip: 'Вы будете получать звонки только из очередей',
    },
  },
  widgets: {
    callInbound: 'Входящих звонков',
    callHandled: 'Обработано звонков',
    callMissed: 'Пропущено звонков',
    avgTalk: 'Среднее время разговора',
    avgHold: 'Среднее время удержания',
    utilization: 'Утилизация',
    occupancy: 'Занятость',
    chatAccepts: 'Количество принятых чатов',
    chatAht: 'Среднее время обработки чата',
    scoreCount: 'Оценено звонков',
    scoreAvg: 'Общая оценка',
    sumTalk: 'Общее время разговора',
    processing: 'Время после вызова',
    available: 'Готов к работе',
    voiceMail: 'Время работы с VM',
    queueTalk: 'Время в разговоре (входящая + исходящая линии)',
    taskAccepts: 'Количество отработанных задач',
  },
  queueSec: {
    call: {
      calls: 'Звонки',
      at: 'в', // missed call "at 10:10"
    },
    chat: {
      chats: 'Чаты',
    },
    job: {
      jobs: 'Задания',
    },
  },
  infoSec: {
    generalInfo: {
      generalInfo: 'Основная информация',
      queueWaiting: 'Ожидают',
      queue: 'Очередь | Очереди',
      agents: 'Операторы',
      total: 'Все',
      pauses: 'Паузы',
      free: 'Свободно',
      score: 'Оценка оператора',
    },
    clientInfo: 'Информация',
    contacts: {
      client: 'Клиент',
      manager: 'Владелец',
      emptyTab: 'Нет { title }',
      emptyContact: 'Контактов не найдено',
      foundOneContact: 'Найдено { count } контактов',
      foundSomeContact: '{ current } с { count } контактов',
      destination: 'Назначение',
      communications: 'Средства связи',
      searchPlaceholder: 'Введите критерии для поиска',
    },
    knowledgeBase: 'База знаний',
    processing: {
      title: 'Обработка задачи',
      reporting: {
        isSuccess: 'Была ли задача успешной?',
        yes: 'Да',
        no: 'Нет',
        nextDistributeAtTitle: 'Запланировать следующую задачу?',
        nextDistributeAt: 'Время следующей задачи',
      },
      form: {
        formFile: {
          deleteConfirmation: 'Вы уверенны, что хотите удалить этот файл?',
          empty: 'Пока здесь нет файлов',
        },
      },
    },
  },
  workspaceSec: {
    callState: {
      ringing: 'Звоним..',
      hold: 'Удержание',
      hangup: 'Конец',
    },
    chat: {
      acceptPreviewText: 'Если вы готовы ответить, нажмите кнопку "Принять"',
      draftPlaceholder: 'Напишите сообщение...',
      dropzone: {
        title: 'Перетащите файлы сюда',
        description: 'Чтобы отправить их',
      },
      confirmClose: 'Вы уверенны, что хотите закрыть активный чат?',
      closedСhat: 'Чат был закрыт',
    },
  },
  emptyWorkspace: {
    empty: {
      heading: 'Сейчас нет новых звонков или чатов',
      text: 'Пожалуйста, подождите! Хорошего дня!',
    },
    transfer: {
      heading: 'Спасибо!',
      text: 'Задача была переведена на другого оператора',
    },
  },
  emptySearch: {
    heading: 'Йоой!',
    text: 'Поиск не дал результатов',
  },
  bridge: {
    activeCalls: 'Активные звонки',
    bridge: 'Соединить',
  },
  history: {
    today: 'Сегодня',
    yesterday: 'Вчера',
  },
  transfer: {
    selectAgent: 'Выберите агента',
    transfer: 'Перевести',
  },
  agentStatus: {
    callCenter: 'Колл-центр',
    breakPopup: {
      breakReason: 'Причина паузы',
      commons: {
        coffeeBreak: 'Кофе',
        smokeBreak: 'Перекур',
        restroom: 'WC',
        dinner: 'Обед',
        meeting: 'Совещание',
      },
    },
    breakTimer: {
      heading: 'Вы находитесь в режиме {mode}',
      mode: {
        [AgentStatus.Pause]: 'паузы',
        [AgentStatus.BreakOut]: 'принудительной паузы',
      },
      [AgentStatus.BreakOut]: 'Принудительная пауза',
      continueWork: 'Продолжить работу',
    },
  },
  disconnectPopup: {
    title: 'Охх... Что-то пошло не так!',
    mainText: 'Связь была утеряна.',
    reloadBtn: 'Обновить страницу',
  },
  welcomePopup: {
    title: 'Добро пожаловать в Webitel Agent Workspace!',
    subtitle: 'Пожалуйста, проверьте свои устройства и настройки браузера перед началом работы',
    mic: {
      status: 'Разрешение на использование Микрофона',
      message: {
        notFound: 'Микрофон не найден',
        denied: 'Запрещено',
      },
    },
    notifications: {
      status: 'Разрешение на получение Оповещений',
      message: {
        denied: 'Запрещено',
      },
    },
  },
  error: {
    websocket: {
      [DeviceNotFoundError.id]: 'Микрофон не подсоединён. Невозможно выполнить действие.',
      [DeviceNotAllowPermissionError.id]: 'Нет доступа к микрофону. Невозможно выполнить действие.',
      [LicencePermissionError.id.replaceAll('.', '_')]: 'Невозможно работать в Workspace. Истёк срок действия лицензии.',
    },
    endpoint: {
      noLicense: 'Невозможно работать в Workspace. Истёк срок действия лицензии.',
    },
  },
  notifications: {
    message: 'Новое сообщение от {name}',
    userInvite: 'Новый чат от {name',
    closeConversation: '{name} покинул чат',
    [JobState.Distribute]: 'Новое задание: {name}',
  },
  emojiPicker: {
    categoriesLabel: 'Категории',
    emojiUnsupportedMessage: 'Ваш браузер не поддерживает цветовые эмодзи.',
    favoritesLabel: 'Любимые',
    loadingMessage: 'Загрузка…',
    networkErrorMessage: 'Не удалось загрузить эмодзи.',
    regionLabel: 'Emoji picker',
    searchDescription: 'Если результат поиска доступен, нажимайте кнопки вверх или вниз для навигации, и enter для выбора.',
    searchLabel: 'Поиск',
    searchResultsLabel: 'Результаты поиска',
    skinToneDescription: 'После открытия, нажимайте кнопки вверх или вниз для навигации, и enter для выбора.',
    skinToneLabel: 'Выберите тон кожи',
    skinTonesLabel: 'Тон кожи',
    skinTones: [
      'По умолчанию',
      'Светлый',
      'Средне-светлый',
      'Средний',
      'Средне-темный',
      'Темный',
    ],
    categories: {
      custom: 'Свой',
      'smileys-emotion': 'Смайлы и смайлики',
      'people-body': 'Люди и тело',
      'animals-nature': 'Звери и природа',
      'food-drink': 'Еда и напитки',
      'travel-places': 'Путешествия и места',
      activities: 'Активности',
      objects: 'Объекты',
      symbols: 'Символы',
      flags: 'Флаги',
    },
  },
  confirmationPopup: {
    title: 'Подтвердите действие',
  },
};
