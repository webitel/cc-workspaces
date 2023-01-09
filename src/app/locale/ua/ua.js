import {
  DeviceNotAllowPermissionError,
  DeviceNotFoundError, JobState, LicencePermissionError,
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
  },
  queueSec: {
    call: {
      calls: 'Дзвінки',
      at: 'о', // missed call "at 10:10"
    },
    chat: {
      chats: 'Чати',
    },
    job: {
      jobs: 'Завдання',
    },
  },
  infoSec: {
    generalInfo: {
      generalInfo: 'Основна інформація',
      queueWaiting: 'Очікують',
      queue: 'Черга',
      agents: 'Оператори',
      total: 'Всі',
      paused: 'Пауза',
      free: 'Вільні',
      agentTeam: 'Команда',
      reasonPauses: 'Причина пауз',
    },
    clientInfo: 'Інформація',
    knowledgeBase: 'База знань',
    processing: {
      title: 'Обробка задачі',
      reporting: {
        isSuccess: 'Задача була успішна?',
        yes: 'Так',
        no: 'Ні',
        nextDistributeAtTitle: 'Запланувати наступну задачу?',
        nextDistributeAt: 'Час наступної задачі',
      },
      form: {
        formFile: {
          deleteConfirmation: 'Ви впевнені, що хочете видалити цей файл?',
          empty: 'Поки тут немає файлів',
        },
      },
    },
  },
  workspaceSec: {
    callState: {
      ringing: 'Телефоную..',
      hold: 'Утримання',
      hangup: 'Кінець',
    },
    chat: {
      acceptPreviewText: 'Якщо Ви готові відповісти, натисніть кнопку "Відповісти"',
      draftPlaceholder: 'Напишіть повідомлення...',
      dropzone: {
        title: 'Перетягніть файли сюди',
        description: 'Щоб надіслати їх',
      },
      confirmClose: 'Ви впевнені, що хочете закрити активний чат?',
    },
  },
  emptyWorkspace: {
    empty: {
      heading: 'Зараз немає нових дзвінків або чатів',
      text: 'Будь ласка, зачекайте! Гарного дня!',
    },
    transfer: {
      heading: 'Дякую!',
      text: 'Задачу було переведено на іншого оператора',
    },
  },
  emptySearch: {
    heading: 'Йоой!',
    text: 'Пошук не дав результатів',
  },
  bridge: {
    activeCalls: 'Активні дзвінки',
    bridge: 'З\'єднати',
  },
  history: {
    today: 'Сьогодні',
    yesterday: 'Вчора',
  },
  transfer: {
    selectAgent: 'Оберіть оператора',
    transfer: 'Перевести',
  },
  agentStatus: {
    callCenter: 'Кол-центр',
    breakPopup: {
      breakReason: 'Причина паузи',
      commons: {
        coffeeBreak: 'Кава',
        smokeBreak: 'Перекур',
        restroom: 'WC',
        dinner: 'Обід',
        meeting: 'Нарада',
      },
    },
    breakTimer: {
      heading: 'Ви знаходитесь у режимі паузи',
      continueWork: 'Продовжити роботу',
    },
  },
  disconnectPopup: {
    title: 'Охх... Щось пішло не так!',
    mainText: 'Зв\'язок було втрачено.',
    reloadBtn: 'Оновити сторінку',
  },
  welcomePopup: {
    title: 'Вітаємо вас у Webitel Agent Workspace!',
    subtitle: 'Будь ласка, перевірте свої пристрої та налаштування браузера перед початком роботи',
    mic: {
      status: 'Дозвіл на використання Мікрофону',
      message: {
        notFound: 'Мікрофон не знайдено',
        denied: 'Заборонено',
      },
    },
    notifications: {
      status: 'Дозвіл на отримання Сповіщень',
      message: {
        denied: 'Заборонено',
      },
    },
  },
  error: {
    websocket: {
      [DeviceNotFoundError.id]: 'Мікрофон не під\'єднаний. Неможливо виконати дію.',
      [DeviceNotAllowPermissionError.id]: 'Немає доступу до мікрофона. Неможливо виконати дію.',
      [LicencePermissionError.id.replaceAll('.', '_')]: 'Неможливо працювати у Workspace. Закінчився термін ліцензії.',
    },
    endpoint: {
      noLicense: 'Неможливо працювати у Workspace. Закінчився термін ліцензії.',
    },
  },
  notifications: {
    message: 'Нове повідомлення від {name}',
    userInvite: 'Новий чат з {name}',
    closeConversation: '{name} вийшов з чату',
    [JobState.Distribute]: 'Нове завдання: {name}',
  },
  emojiPicker: {
    categoriesLabel: 'Категорії',
    emojiUnsupportedMessage: 'Ваш браузер не підтримує кольорові емодзі.',
    favoritesLabel: 'Улюблені',
    loadingMessage: 'Завантаження…',
    networkErrorMessage: 'Не вдалось завантажити емодзі.',
    regionLabel: 'Emoji picker',
    searchDescription: 'Коли результат пошуку доступний, тисніть кнопки вверх або вниз для навігації, та enter для вибору.',
    searchLabel: 'Пошук',
    searchResultsLabel: 'Результати пошуку',
    skinToneDescription: 'Після відкриття, тисніть кнопки вверх або вниз для навігації, та enter для вибору.',
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
      custom: 'Свій',
      'smileys-emotion': 'Смайли та смайлики',
      'people-body': 'Люди і тіло',
      'animals-nature': 'Тварини та природа',
      'food-drink': 'Їжа та напої',
      'travel-places': 'Подорожі та місця',
      activities: 'Активності',
      objects: 'Об\'єкти',
      symbols: 'Символи',
      flags: 'Прапори',
    },
  },
  confirmationPopup: {
    title: 'Підтвердіть дію',
  },
};
