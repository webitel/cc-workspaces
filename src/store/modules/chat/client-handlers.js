import { snakeToCamel } from '@webitel/ui-sdk/src/scripts/caseConverters';
import { ChatActions } from 'webitel-sdk';
import endChatMedia from '../../../../public/media/end-chat.wav';
import newChatMedia from '../../../../public/media/new-chat.wav';
import newMessageMedia from '../../../../public/media/new-message.wav';
import notificationIcon from '../../../../public/notification-icon.png';
import i18n from '../../../locale/i18n';

const NOTIFICATION_VISIBLE_INTERVAL = 2000;

const getNotificationSound = (action) => {
  switch (action) {
    case ChatActions.UserInvite:
      return newChatMedia;
    case ChatActions.Message:
      return newMessageMedia;
    case ChatActions.Close:
      return endChatMedia;
    default:
      return false;
  }
};

const callHandler = (context) => (action, chat) => {
  switch (action) {
    case ChatActions.UserInvite:
      context.dispatch('HANDLE_INVITE_ACTION', { action, chat });
      break;
    case ChatActions.Message:
      context.dispatch('HANDLE_MESSAGE_ACTION', { action, chat });
      break;
    case ChatActions.Decline:
      break;
    case ChatActions.Leave:
      break;
    case ChatActions.Close:
      context.dispatch('HANDLE_CLOSE_ACTION', { action });
      break;
    case ChatActions.Destroy:
      context.dispatch('HANDLE_DESTROY_ACTION', { chat });
      break;
    default:
    // console.log('default', action);
  }
};

const actions = {
  PLAY_NOTIFICATION_SOUND: async (context, sound) => {
    try {
      await new Audio(sound).play();
    } catch (err) {
      throw err;
    }
  },

  SUBSCRIBE_CHATS: async (context) => {
    const client = await context.rootState.client.getCliInstance();
    await client.subscribeChat(callHandler(context), null);
    const chatList = client.allConversations();
    if (chatList.length) context.dispatch('SET_CHAT_LIST', chatList);
  },

  HANDLE_INVITE_ACTION: (context, { action, chat }) => {
    const notificationText = i18n.t(`notifications.${snakeToCamel(action)}`);
    const sound = getNotificationSound(action);
    context.dispatch('PLAY_NOTIFICATION_SOUND', sound);
    context.dispatch('SHOW_NOTIFICATION', notificationText);
    context.dispatch('ADD_CHAT', chat);
    if (context.rootGetters['workspace/IS_EMPTY_WORKSPACE']) {
      context.dispatch('SET_WORKSPACE', chat);
    }
  },

  HANDLE_MESSAGE_ACTION: (context, { action, chat }) => {
    const notificationText = i18n.t(`notifications.${snakeToCamel(action)}`);
    const message = chat.messages[chat.messages.length - 1];

    if (!context.getters.IS_MY_MESSAGE(message)) {
      const sound = getNotificationSound(action);
      context.dispatch('PLAY_NOTIFICATION_SOUND', sound);
      context.dispatch('SHOW_NOTIFICATION', notificationText);
    }
    context.dispatch('CHAT_INSERT_TO_START', chat);
  },

  HANDLE_DESTROY_ACTION: (context, { chat }) => {
    context.commit('REMOVE_CHAT', chat);
    context.dispatch('RESET_WORKSPACE');
    context.dispatch('RESET_UNREAD_COUNT');
  },

  HANDLE_CLOSE_ACTION: (context, { action }) => {
    const notificationText = i18n.t(`notifications.${snakeToCamel(action)}`);
    const sound = getNotificationSound(action);
    context.dispatch('PLAY_NOTIFICATION_SOUND', sound);
    context.dispatch('SHOW_NOTIFICATION', notificationText);
  },

  SHOW_NOTIFICATION: async (context, notificationText) => {
    context.dispatch('INCREMENT_UNREAD_COUNT');
    const notification = new Notification(notificationText, {
      icon: notificationIcon,
    });

    document.documentElement.addEventListener('click', () => {
      context.dispatch('RESET_UNREAD_COUNT');
      if (Notification.permission !== 'granted') Notification.requestPermission();
    });

    setTimeout(() => {
      notification.close();
    }, NOTIFICATION_VISIBLE_INTERVAL);
  },
};

export default {
  actions,
};
