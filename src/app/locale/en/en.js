import {
  AgentStatus,
  DeviceNotAllowPermissionError,
  DeviceNotFoundError,
  JobState,
  LicencePermissionError,
} from 'webitel-sdk';

export default {
  reusable: {
    answer: 'Answer',
    reject: 'Reject',
    accept: 'Accept',
    decline: 'Decline',
    send: 'Send',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    logout: 'Logout',
    search: 'Search',
    description: 'Description',
    settings: 'Settings',
    edit: 'Edit',
    select: 'Select',
    run: 'Run',
    today: 'Today',
    phoneNumber: 'Phone number'
  },
  feedback: {
    success: {
      title: 'Thank You!',
      description: 'We’ve saved your response successfully',
    },
    error: {
      title: 'Oops!',
      description: 'Something went wrong',
    },
  },
  appNavigator: {
    title: 'Webitel applications',
    admin: 'Admin',
    agent: 'Agent Workspace',
    supervisor: 'Supervisor Workspace',
    audit: 'Audit',
    history: 'Call History',
    grafana: 'Grafana',
  },
  header: {
    docs: 'Docs',
    enableVideo: 'Enable video',
    dnd: {
      label: 'DnD',
      tooltip: 'You will receive calls from queues only',
    },
  },
  widgets: {
    callInbound: 'Inbound calls',
    callInboundQueue: 'Inbound queue calls',
    callDialerQueue: 'All dialer calls',
    callManual: 'Manual calls',
    callHandled: 'Processed Calls',
    callMissed: 'Missed Calls',
    callQueueMissed: 'Missed from queues',
    avgTalk: 'Avg Talk Time',
    avgHold: 'Avg Hold Time',
    utilization: 'Utilization',
    occupancy: 'Occupancy',
    chatAccepts: 'Processed Chats',
    chatAht: 'Chat Handling Time',
    scoreCount: 'Rated calls',
    scoreAvg: 'Total score',
    sumTalk: 'Total Talk Time',
    processing: 'After Call Work Time',
    available: 'Available',
    voiceMail: 'Total VM Time',
    queueTalk: 'Queue Talk Time',
    taskAccepts: 'Task Quantity',
  },
  queueSec: {
    call: {
      call: 'Call | Calls',
      preview: {
        md: {
          active: 'Active calls',
          missed: 'Missed calls',
          offline: 'Offline calls',
          manual: 'Self-assigned calls',
        },
        sm: {
          active: 'Active',
          missed: 'Missed',
          offline: 'Offline',
          manual: 'Self-assigned',
        },
      },
    },
    chat: {
      chats: 'Chat | Chats',
      preview: {
        md: {
          active: 'Active chats',
          manual: 'Self-assigned chats',
          closed: 'Closed chats',
        },
        sm: {
          active: 'Active',
          manual: 'Self-assigned',
          closed: 'Closed',
        },
      },
    },
    job: {
      jobs: 'Task | Tasks',
      preview: {
        md: {
          active: 'Active tasks',
        },
        sm: {
          active: 'Active',
        },
      },
    },
  },
  notification: {
    callEnded: 'The call with {name} has ended',
    chatEnded: 'The chat with {name} has ended',
    jobEnded: 'The task "{name}" has ended',
  },
  infoSec: {
    generalInfo: {
      generalInfo: 'General info',
      queueWaiting: 'Waiting',
      queue: 'Queue | Queues',
      agents: 'Agents',
      total: 'Total',
      pauses: 'Pauses',
      free: 'Free',
      score: 'Agent score',
    },
    clientInfo: 'Client info',
    memberDescription: 'Member description',
    variables: 'Variables',
    contacts: {
      client: 'Client',
      manager: 'Owner',
      attributes: 'Attribute | Attributes',
      emptyContact: 'No contact found',
      emptyLabels: 'There are no labels',
      emptyAttributes: 'There are no attributes',
      emptyDescription: 'There are no description',
      foundOneContact: '{ count } found contact',
      foundSomeContact: '{ current } of { count } contacts',
      communications: 'Communication options',
      destination: 'Destination',
      searchPlaceholder: 'Enter search criterias',
    },
    knowledgeBase: 'Knowledge base',
    processing: {
      title: 'Task processing',
      reporting: {
        isSuccess: 'Was this task successful?',
        yes: 'Yes',
        no: 'No',
        nextDistributeAtTitle: 'Schedule next task?',
        nextDistributeAt: 'Next task time',
      },
      form: {
        formFile: {
          deleteConfirmation: 'Are you sure you want to delete this file?',
          empty: 'There are no files yet',
        },
        formTable: {
          title: 'Table',
          error: 'Your table data has invalid format. Please, check your flow.',
        },
      },
    },
    flows: {
      dummy: 'No schemes have been configured yet',
      runFlowSuccess: 'Schema launched successfully',
      runFlowError: 'Failed to run the schema',
    },
  },
  workspaceSec: {
    callState: {
      ringing: 'Ringing..',
      hold: 'Hold',
      hangup: 'Hangup',
    },
    chat: {
      acceptPreviewText:
        'If you are ready to answer, click "Accept" button first',
      draftPlaceholder: 'Write a message...',
      dropzone: {
        title: 'Drop your files here',
        description: 'To upload them',
      },
      confirmClose: 'Are you sure you want to close active chat?',
      closedСhat: 'The chat was closed',
      chatStarted: 'Chat started',
      chatEnded: 'Chat ended',
      chatTransferred: 'Chat transferred',
      chatsAgent: '{ agentName } has joined the chat',
      chatsAgentsList: '{ agentName } participated in the chat',
      chatsFileBlocked: 'File quarantined or blocked',
    },
  },
  emptyWorkspace: {
    empty: {
      heading: 'There are currently no calls or chats',
      text: 'Please wait! Have a nice work!',
    },
    transfer: {
      heading: 'Thank You!',
      text: 'Task has been transferred to another operator',
    },
  },
  emptySearch: {
    heading: 'Oops!',
    text: 'Search has not given any results',
  },
  bridge: {
    activeCalls: 'Active calls',
    bridge: 'Bridge',
  },
  history: {
    today: 'Today',
    yesterday: 'Yesterday',
    openInHistory: 'Open in History',
  },
  transfer: {
    selectAgent: 'Please select an agent',
    transfer: 'Transfer',
  },
  contacts: {
    phones: 'Phone | Phones',
    emails: 'Email | Emails',
  },
  agentStatus: {
    callCenter: 'Call Center',
    breakPopup: {
      breakReason: 'Reason for break',
      commons: {
        coffeeBreak: 'Coffee break',
        smokeBreak: 'Smoke break',
        restroom: 'Restroom',
        dinner: 'Dinner',
        meeting: 'Meeting',
      },
    },
    breakTimer: {
      heading: 'You are in {mode} mode now',
      mode: {
        [AgentStatus.Pause]: 'break',
        [AgentStatus.BreakOut]: 'break out',
      },
      [AgentStatus.BreakOut]: 'Break out',
      continueWork: 'Continue work',
    },
  },
  disconnectPopup: {
    title: 'Ohh.. Something went wrong!',
    mainText: 'Connection was accidentally interrupted.',
    reloadBtn: 'Reload page',
  },
  welcomePopup: {
    title: 'Welcome to Webitel Agent Workspace!',
    subtitle: 'Please, check your devices and browser permission before start',
    mic: {
      status: 'Microphone permission status',
      message: {
        notFound: 'Microphone not found',
        denied: 'Permission denied',
      },
    },
    notifications: {
      status: 'Notifications permission status',
      message: {
        denied: 'Permission denied',
      },
    },
  },
  descTrackAuthPopup: {
    title: 'Attention',
    errorLabel: 'You can’t work in Workspace',
    errorDescription: 'DeskTrack is not running, or you are not logged in',
    successLabel: 'DeskTrack is launched successfully',
    successDescription: 'You can work in Workspace',
  },
  error: {
    general: 'An error occured. Please, try again.',
    websocket: {
      [DeviceNotFoundError.id]:
        "Microphone is'nt connected. Cannot perform action.",
      [DeviceNotAllowPermissionError.id]:
        'Microphone access is denied. Cannot perform action.',
      [LicencePermissionError.id.replaceAll('.', '_')]:
        'You can not work in Workspace because your license has expired.',
    },
    endpoint: {
      noLicense:
        'You can not work in Workspace because your license has expired.',
    },
  },
  notifications: {
    message: 'New message from {name}',
    userInvite: 'New chat invite from {name}',
    closeConversation: '{name} left the chat',
    [JobState.Distribute]: 'New task: {name}',
    newCall: 'New call',
    closedChatError: 'Failed to load closed chats',
  },
  emojiPicker: {
    categoriesLabel: 'Categories',
    emojiUnsupportedMessage: 'Your browser does not support color emoji.',
    favoritesLabel: 'Favorites',
    loadingMessage: 'Loading…',
    networkErrorMessage: 'Could not load emoji.',
    regionLabel: 'Emoji picker',
    searchDescription:
      'When search results are available, press up or down to select and enter to choose.',
    searchLabel: 'Search',
    searchResultsLabel: 'Search results',
    skinToneDescription:
      'When expanded, press up or down to select and enter to choose.',
    skinToneLabel: 'Choose a skin tone',
    skinTonesLabel: 'Skin tones',
    skinTones: [
      'Default',
      'Light',
      'Medium-Light',
      'Medium',
      'Medium-Dark',
      'Dark',
    ],
    categories: {
      custom: 'Custom',
      'smileys-emotion': 'Smileys and emoticons',
      'people-body': 'People and body',
      'animals-nature': 'Animals and nature',
      'food-drink': 'Food and drink',
      'travel-places': 'Travel and places',
      activities: 'Activities',
      objects: 'Objects',
      symbols: 'Symbols',
      flags: 'Flags',
    },
  },
  confirmationPopup: {
    title: 'Confirm action',
  },
  autocompleteList: {
    quickReplies: ({ linked }) =>
      `/${linked('objects.quickReplies.quickReplies', 1).toLowerCase()}`,
    quickRepliesDescription:
      'Opens a menu of pre-set quick replies for chat responses',
  },
};
