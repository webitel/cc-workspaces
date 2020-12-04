import { ChatActions } from 'webitel-sdk';
import { getCliInstance } from '../../../api/agent-workspace/call-ws-connection';

const callHandler = (context) => (action, chat) => {
  switch (action) {
    case ChatActions.UserInvite:
      context.dispatch('HANDLE_INVITE_ACTION', chat);
      break;
    case ChatActions.Message:
      context.dispatch('HANDLE_MESSAGE_ACTION', chat);
      break;
    case ChatActions.Decline:
      context.dispatch('HANDLE_CLOSE_ACTION', chat);
      break;
    case ChatActions.Leave:
      context.dispatch('HANDLE_CLOSE_ACTION', chat);
      break;
    case ChatActions.Close:
      context.dispatch('HANDLE_CLOSE_ACTION', chat);
      break;
    default:
    // console.log('default', action);
  }
};

const actions = {
  SUBSCRIBE_CHATS: async (context) => {
    const client = await getCliInstance();
    await client.subscribeChat(callHandler(context), null);
    const chatList = client.allConversations();
    if (chatList.length) context.commit('SET_CHAT_LIST', chatList);
  },

  HANDLE_INVITE_ACTION: (context, chat) => {
    // console.info(JSON.stringify({ ...chat, client: null }));
    context.commit('ADD_CHAT', chat);
  },

  HANDLE_MESSAGE_ACTION: () => {
    // context.commit('ADD_CALL', chat);
  },

  HANDLE_CLOSE_ACTION: (context, chat) => {
    context.commit('REMOVE_CHAT', chat);
    context.dispatch('RESET_WORKSPACE');
  },
};

export default {
  actions,
};
