import { DeviceNotFoundError, DeviceNotAllowPermissionError } from 'webitel-sdk';

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
    inbound: 'Inbound',
    handles: 'Processed Calls',
    missed: 'Missed Calls',
    avgTalk: 'Avg Talk Time',
    avgHold: 'Avg Hold Time',
    utilization: 'Utilization',
    occupancy: 'Occupancy',
    chatAccepts: 'Accepted chats',
    chatAht: 'Chat Handling Time',
  },
  queueSec: {
    call: {
      calls: 'Calls',
      at: 'at', // missed call "at 10:10"
    },
    chat: {
      chats: 'Chats',
    },
  },
  infoSec: {
    generalInfo: {
      generalInfo: 'General info',
      queueWaiting: 'Waiting',
      queue: 'Queue',
      agents: 'Agents',
      total: 'Total',
      paused: 'Paused',
      free: 'Free',
    },
    clientInfo: 'Client info',
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
    },
  },
  workspaceSec: {
    callState: {
      ringing: 'Ringing..',
      hold: 'Hold',
      hangup: 'Hangup',
    },
    chat: {
      acceptPreviewText: 'If you are ready to answer, click "Accept" button first',
      draftPlaceholder: 'Write a message...',
      dropzone: {
        title: 'Drop your files here',
        description: 'To upload them',
      },
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
  },
  transfer: {
    selectAgent: 'Please select an agent',
    transfer: 'Transfer',
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
      heading: 'You are in break mode now',
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
  error: {
    websocket: {
      [DeviceNotFoundError.id]: 'Microphone is\'nt connected. Cannot perform action.',
      [DeviceNotAllowPermissionError.id]: 'Microphone access is denied. Cannot perform action.',
    },
  },
  notifications: {
    message: 'New message from {name}',
    userInvite: 'New chat invite from {name}',
    closeConversation: '{name} left the chat',
  },
  emojiPicker: {
    categoriesLabel: 'Categories',
    emojiUnsupportedMessage: 'Your browser does not support color emoji.',
    favoritesLabel: 'Favorites',
    loadingMessage: 'Loading…',
    networkErrorMessage: 'Could not load emoji.',
    regionLabel: 'Emoji picker',
    searchDescription: 'When search results are available, press up or down to select and enter to choose.',
    searchLabel: 'Search',
    searchResultsLabel: 'Search results',
    skinToneDescription: 'When expanded, press up or down to select and enter to choose.',
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
};
