import { ChatActions } from 'webitel-sdk';

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
      context.dispatch('HANDLE_CLOSE_ACTION', { action, chat });
      break;
    case ChatActions.Destroy:
      context.dispatch('HANDLE_DESTROY_ACTION', { action, chat });
      break;
    default:
    // console.log('default', action);
  }
};

const actions = {
  SUBSCRIBE_CHATS: async (context) => {
    const client = await context.rootState.client.getCliInstance();
    await client.subscribeChat(callHandler(context), null);
    const chatList = client.allConversations();
    if (chatList.length) context.dispatch('SET_CHAT_LIST', chatList);
  },

  HANDLE_INVITE_ACTION: (context, { action, chat }) => {
    context.dispatch('notifications/TEST_NOTIFY', { action, id: chat.id }, { root: true });
    // context.dispatch('notifications/TEST_NOTIFY', { action, details: chat }, { root: true });
    // context.dispatch('notifications/NOTIFICATION_CHECK', { action, chat }, { root: true });
    // context.dispatch('notifications/NOTIFY', action, { root: true });
    context.dispatch('ADD_CHAT', chat);
    if (context.rootGetters['workspace/IS_EMPTY_WORKSPACE']) {
      context.dispatch('SET_WORKSPACE', chat);
    }
  },

  HANDLE_MESSAGE_ACTION: (context, { action, chat }) => {
    const message = chat.messages[chat.messages.length - 1];
    const notificationParams = { action, id: chat.id, messageId: message.id };
    if (!context.getters.IS_MY_MESSAGE(message)) {
      // context.dispatch('notifications/NOTIFY', action, { root: true });
      // context.dispatch('notifications/NOTIFICATION_CHECK', { action, chat, message }, { root: true });
      context.dispatch('notifications/TEST_NOTIFY', notificationParams, { root: true });
    }
    context.dispatch('CHAT_INSERT_TO_START', chat);
  },

  HANDLE_DESTROY_ACTION: (context, { chat }) => {
    context.commit('REMOVE_CHAT', chat);
    context.dispatch('RESET_WORKSPACE');
    // context.dispatch('notifications/RESET_UNREAD_COUNT', null, { root: true });
  },

  HANDLE_CLOSE_ACTION: (context, { action, chat }) => {
    // context.dispatch('notifications/NOTIFY', action, { root: true });
    // context.dispatch('notifications/NOTIFICATION_CHECK', { action, chat }, { root: true });
    context.dispatch('notifications/TEST_NOTIFY', { action, id: chat.id }, { root: true });
  },
};

export default {
  actions,
};
