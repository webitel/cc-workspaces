import { snakeToCamel } from '@webitel/ui-sdk/src/scripts/caseConverters';
import { ChatActions } from 'webitel-sdk';
import endChatSound from '../../../../public/media/end-chat.wav';
import newChatSound from '../../../../public/media/new-chat.wav';
import newMessageSound from '../../../../public/media/new-message.wav';
import ringingSound from '../../../../public/media/ringing.mp3';
import notificationIcon from '../../../../public/notification-icon.png';
import i18n from '../../../locale/i18n';

const NOTIFICATION_VISIBLE_INTERVAL = 2000;

const localStoragePlaying = () => localStorage.getItem('isPlaying');
const localStorageConversation = () => localStorage.getItem('isConversation');

const getNotificationSound = (action) => {
  switch (action) {
    case ChatActions.UserInvite:
      return new Audio(newChatSound);
    case ChatActions.Message:
      return new Audio(newMessageSound);
    case ChatActions.Close:
      return new Audio(endChatSound);
    default:
      return false;
  }
};

const getStorageId = () => localStorage.getItem('windowId');

const setStorageId = (value) => {
  localStorage.setItem('windowId', value);
};

const state = {
  windowId: null,
  broadcastChannel: null, // in order to reset the tab title with unread number
  unreadCount: 0,
  currentlyPlaying: false,
  isConversation: false,
};

const getters = {
  IS_MAIN_TAB: (state) => state.windowId === getStorageId(),
  IS_PLAYING: (state) => localStoragePlaying() && state.currentlyPlaying,
  IS_CONVERSATION: (state) => localStorageConversation() && state.isConversation,
  SOUND_IS_ALLOWED: (state, getters) => !getters.IS_CONVERSATION && !getters.IS_PLAYING,
};

const actions = {
  INIT_NOTIFICATIONS: (context) => {
    const windowId = Math.random().toString();
    context.commit('SET_WINDOW_ID', windowId);
    setStorageId(windowId);

    const broadcastChannel = new BroadcastChannel('broadcastChannel');
    broadcastChannel.addEventListener('message', ({ data }) => {
      context.dispatch('SET_UNREAD_COUNT', data.count);
    });
    context.commit('SET_BROADCAST_CHANNEL', broadcastChannel);
    context.dispatch('SUBSCRIBE_TAB_CLOSING');
  },

  SUBSCRIBE_TAB_CLOSING: (context) => {
    // listen to localStorage change and set windowId if no one saved
    window.addEventListener('storage', () => {
      if (!getStorageId()) {
        setStorageId(context.state.windowId);
      }
    });
    context.state.broadcastChannel.close();
  },

  NOTIFY: (context, { action, chat }) => {
    const sound = getNotificationSound(action);
    context.dispatch('PLAY_NOTIFICATION', sound);
    if (context.rootGetters['workspace/TASK_ON_WORKSPACE'].channelId !== chat.channelId) {
      context.dispatch('SHOW_NOTIFICATION', action);
    }
  },

  SHOW_NOTIFICATION: async (context, action) => {
    const notificationText = i18n.t(`notifications.${snakeToCamel(action)}`);
    context.dispatch('INCREMENT_UNREAD_COUNT');
    document.documentElement.addEventListener('click', () => {
      context.dispatch('RESET_UNREAD_COUNT');
    });

    const notification = new Notification(notificationText, {
      icon: notificationIcon,
    });
    notification.addEventListener('click', () => {
      window.focus();
    });

    setTimeout(() => {
      notification.close();
      notification.removeEventListener('click', () => {
        window.focus();
      });
    }, NOTIFICATION_VISIBLE_INTERVAL);
  },

  INCREMENT_UNREAD_COUNT: (context) => {
    const count = context.state.unreadCount + 1;
    context.state.broadcastChannel.postMessage({ count });
    context.dispatch('SET_UNREAD_COUNT', count);
  },

  SET_UNREAD_COUNT: (context, count) => {
    context.commit('SET_UNREAD_COUNT', count);
    context.dispatch('SET_TAB_TITLE');
  },

  RESET_UNREAD_COUNT: (context) => {
    const count = 0;
    context.state.broadcastChannel.postMessage({ count });
    context.dispatch('SET_UNREAD_COUNT', count);
  },

  SET_TAB_TITLE: (context) => {
    const count = context.state.unreadCount;
    const titleText = document.title.replace(/\s*\(.*?\)\s*/g, '');
    document.title = count ? `(${count}) ${titleText}` : titleText;
  },

  PLAY_NOTIFICATION: (context, sound) => {
    if (context.getters.SOUND_IS_ALLOWED && context.getters.IS_MAIN_TAB) {
      try {
        sound.addEventListener('ended', () => {
          context.dispatch('STOP_PLAYING', sound);
        });
        context.dispatch('PLAY_SOUND', sound);
      } catch (err) {
        throw err;
      }
    }
  },

  RING_CALL: (context) => {
    const sound = new Audio(ringingSound);
    sound.loop = true;
    context.dispatch('PLAY_SOUND', sound);
  },

  PLAY_SOUND: (context, sound) => {
    sound.play();
    localStorage.setItem('isPlaying', 'true');
    context.commit('PLAY_SOUND', sound);
  },

  STOP_PLAYING: (context, sound) => {
    const currentSound = sound ?? context.state.currentlyPlaying;
    if (currentSound) {
      currentSound.pause();
    }
    localStorage.removeItem('isPlaying');
    context.commit('STOP_PLAYING');
  },

  START_CONVERSATION: (context) => {
    localStorage.setItem('isConversation', 'true');
    context.commit('START_CONVERSATION');
  },

  END_CONVERSATION: (context) => {
    localStorage.removeItem('isConversation');
    context.commit('END_CONVERSATION');
  },
};

const mutations = {
  SET_WINDOW_ID: (state, windowId) => {
    state.windowId = windowId;
  },
  SET_BROADCAST_CHANNEL: (state, channel) => {
    state.broadcastChannel = channel;
  },
  PLAY_SOUND: (state, sound) => {
    state.currentlyPlaying = sound;
  },
  STOP_PLAYING: (state) => {
    state.currentlyPlaying = false;
  },
  SET_UNREAD_COUNT: (state, count) => {
    state.unreadCount = count;
  },
  START_CONVERSATION: (state) => {
    state.isConversation = true;
  },
  END_CONVERSATION: (state) => {
    state.isConversation = false;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
