import { snakeToCamel } from '@webitel/ui-sdk/src/scripts/caseConverters';
import { ChatActions } from 'webitel-sdk';
import endChatSound from '../../../../public/media/end-chat.wav';
import newChatSound from '../../../../public/media/new-chat.wav';
import newMessageSound from '../../../../public/media/new-message.wav';
import ringingSound from '../../../../public/media/ringing.mp3';
import notificationIcon from '../../../../public/notification-icon.png';
import i18n from '../../../locale/i18n';

const NOTIFICATION_VISIBLE_INTERVAL = 2000;

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

const getLastMessage = (chat) => chat.messages[chat.messages.length - 1];

const getStorageId = () => localStorage.getItem('windowId');

const setStorageId = (context, value) => {
  localStorage.setItem('windowId', value);
  context.commit('SET_STORAGE_ID', context.state.windowId);
};

const state = {
  windowId: null,
  storageId: null,
  broadcastChannel: null, // in order to reset the tab title with unread number
  unreadCount: 0,
  currentlyPlaying: false,
  isCall: false,
};

const getters = {
  IS_MAIN_TAB: (state) => state.windowId === state.storageId,
  IS_SOUND_ALLOWED: (state) => !state.isCall && !state.currentlyPlaying,
};

const actions = {
  INIT_NOTIFICATIONS: (context) => {
    context.dispatch('SETUP_WINDOW_ID');

    const broadcastChannel = new BroadcastChannel('appNotifications');
    broadcastChannel.addEventListener('message', ({ data }) => {
      context.dispatch('SET_UNREAD_COUNT', data.count);
    });

    document.documentElement.addEventListener('click', () => {
      context.dispatch('RESET_UNREAD_COUNT');
    });
    context.dispatch('SUBSCRIBE_TAB_CLOSING');
    context.commit('SET_BROADCAST_CHANNEL', broadcastChannel);
  },

  SUBSCRIBE_TAB_CLOSING: (context) => {
    window.addEventListener('storage', () => {
      if (!getStorageId()) {
        setStorageId(context, context.state.windowId);
      }
    });
  },

  SETUP_WINDOW_ID: (context) => {
    const windowId = Math.random().toString();
    context.commit('SET_WINDOW_ID', windowId);
    setStorageId(context, windowId);
  },

  NOTIFY: (context, { action, chat }) => {
    const sound = getNotificationSound(action);
    context.dispatch('PLAY_NOTIFICATION_SOUND', sound);
    context.dispatch('INCREMENT_UNREAD_COUNT');
    if (context.rootGetters['workspace/TASK_ON_WORKSPACE'].channelId !== chat.channelId
    && context.getters.IS_MAIN_TAB) {
      const name = getLastMessage(chat)?.member?.name || chat.messages[0].member.name;
      context.dispatch('SHOW_NOTIFICATION', { action, name });
    }
  },

  SHOW_NOTIFICATION: async (context, { action, name }) => {
    const notificationText = i18n.t(`notifications.${snakeToCamel(action)}`, { name });

    const notification = new Notification(notificationText, {
      icon: notificationIcon,
    });

    notification.addEventListener('click', () => {
      window.focus();
    }, { once: true });

    setTimeout(() => {
      notification.close();
    }, NOTIFICATION_VISIBLE_INTERVAL);
  },

  INCREMENT_UNREAD_COUNT: (context) => {
    const count = context.state.unreadCount + 1;
    context.dispatch('SET_UNREAD_COUNT', count);
    context.state.broadcastChannel.postMessage({ count });
  },

  SET_UNREAD_COUNT: (context, count) => {
    context.commit('SET_UNREAD_COUNT', count);
    context.dispatch('SET_TAB_TITLE');
  },

  RESET_UNREAD_COUNT: (context) => {
    if (context.state.unreadCount === 0) return;
    const count = 0;
    context.dispatch('SET_UNREAD_COUNT', count);
    context.state.broadcastChannel.postMessage({ count });
  },

  SET_TAB_TITLE: (context) => {
    const count = context.state.unreadCount;
    const titleText = document.title.replace(/\s*\(.*?\)\s*/g, '');
    document.title = count ? `(${count}) ${titleText}` : titleText;
  },

  PLAY_NOTIFICATION_SOUND: (context, sound) => {
    if (context.getters.IS_SOUND_ALLOWED
      && context.getters.IS_MAIN_TAB
      && !localStorage.getItem('isPlaying')
      && !localStorage.getItem('isCall')
      ) {
      try {
        sound.addEventListener('ended', () => {
          context.dispatch('STOP_PLAYING', sound);
        }, { once: true });
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
    context.commit('SET_CURRENTLY_PLAYING', sound);
  },

  STOP_PLAYING: (context, sound) => {
    const currentSound = sound ?? context.state.currentlyPlaying;
    if (currentSound) {
      currentSound.pause();
    }
    localStorage.removeItem('isPlaying');
    context.commit('RESET_CURRENTLY_PLAYING');
  },

  HANDLE_CALL_START: (context) => {
    localStorage.setItem('isCall', 'true');
    context.commit('HANDLE_CALL_START');
  },

  HANDLE_CALL_END: (context) => {
    localStorage.removeItem('isCall');
    context.commit('HANDLE_CALL_END');
  },

  REMOVE_STORAGE_ID: () => {
    localStorage.removeItem('windowId');
  },
};

const mutations = {
  SET_WINDOW_ID: (state, windowId) => {
    state.windowId = windowId;
  },

  SET_STORAGE_ID: (state, storageId) => {
    state.storageId = storageId;
  },

  SET_BROADCAST_CHANNEL: (state, channel) => {
    state.broadcastChannel = channel;
  },
  SET_CURRENTLY_PLAYING: (state, sound) => {
    state.currentlyPlaying = sound;
  },
  RESET_CURRENTLY_PLAYING: (state) => {
    state.currentlyPlaying = false;
  },
  SET_UNREAD_COUNT: (state, count) => {
    state.unreadCount = count;
  },
  HANDLE_CALL_START: (state) => {
    state.isCall = true;
  },
  HANDLE_CALL_END: (state) => {
    state.isCall = false;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
