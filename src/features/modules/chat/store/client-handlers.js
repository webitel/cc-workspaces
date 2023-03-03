import { ChatActions } from 'webitel-sdk';

const callHandler = (context) => async (action, chat) => {
  context.commit('SET_CHAT_LIST', []);
  const client = await context.rootState.client.getCliInstance();
  const chatList = client.allConversations();
  context.commit('SET_CHAT_LIST', chatList);
  await context.dispatch('workspace/UPDATE_STATE_HISTORY_RECORD', chat, { root: true });
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
    context.dispatch('ADD_CHAT', chat);
    if (context.rootGetters['workspace/IS_EMPTY_WORKSPACE']) {
      context.dispatch('SET_WORKSPACE', chat);
    }
    context.dispatch('HANDLE_CHAT_EVENT', { action, chat });
  },

  HANDLE_MESSAGE_ACTION: (context, { action, chat }) => {
    const message = chat.messages[chat.messages.length - 1];
    if (!context.getters.IS_MY_MESSAGE(message)) {
      context.dispatch('HANDLE_CHAT_EVENT', { action, chat });
    }
    context.dispatch('CHAT_INSERT_TO_START', chat);
  },

  HANDLE_DESTROY_ACTION: (context, { chat }) => {
    context.commit('REMOVE_CHAT', chat);
    context.dispatch('RESET_WORKSPACE');
    context.dispatch('_RESET_UNREAD_COUNT');
  },

  HANDLE_CLOSE_ACTION: (context, { action, chat }) => {
    context.dispatch('HANDLE_CHAT_EVENT', { action, chat });
  },
};

export default {
  actions,
};
