import { ChatActions } from 'webitel-sdk';

import openLinkFromVariable from '../../../../app/scripts/openLinkFromVariable';

const chatHandler = (context) => async (action, chat) => {
  switch (action) {
    case ChatActions.UserInvite:
      context.dispatch('HANDLE_INVITE_ACTION', { action, chat });
      break;
    case ChatActions.Joined:
      context.dispatch('HANDLE_JOINED_ACTION', { action, chat });
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
  }
};

const actions = {
  SUBSCRIBE_CHATS: async (context) => {
    const client = await context.rootState.client.getCliInstance();
    await client.subscribeChat(chatHandler(context), null);
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

  HANDLE_JOINED_ACTION: (context, { chat }) => {
    openLinkFromVariable(chat);
    context.dispatch('SET_MEMBERS_TO_CHAT', chat);
  },

  HANDLE_MESSAGE_ACTION: (context, { action, chat }) => {
    const message = chat.messages[chat.messages.length - 1];
    if (!context.getters.IS_MY_MESSAGE(message)) {
      context.dispatch('HANDLE_CHAT_EVENT', { action, chat });
    }
    context.dispatch('CHAT_INSERT_TO_START', chat);
  },

  RESET_CHAT: (context, chat) => {
    context.commit('REMOVE_CHAT', chat);
    context.dispatch('RESET_WORKSPACE');
    context.dispatch('_RESET_UNREAD_COUNT');
    context.dispatch('RESET_CHAT_HISTORY');
    context.dispatch('LOAD_CLOSED_CHATS');
  },

  HANDLE_DESTROY_ACTION: (context, { chat }) => {
    // action after processing or when chat was closed by agent
    context.dispatch('RESET_CHAT', chat);
  },

  HANDLE_CLOSE_ACTION: (context, { action, chat }) => {
    // when chat closed by client or timeout
    context.dispatch('HANDLE_CHAT_EVENT', { action, chat });

    if (!chat.allowReporting) {
      // https://webitel.atlassian.net/browse/WTEL-5631
      context.dispatch('RESET_CHAT', chat);
    }
  },
  HANDLE_CHAT_EVENT: (context, { action, chat }) =>
    context.dispatch(
      'features/chatNotifications/HANDLE_CHAT_EVENT',
      {
        action,
        chat,
      },
      { root: true },
    ),
  RESET_CHAT_HISTORY: (context) =>
    context.dispatch('features/chat/chatHistory/RESET_CHAT_HISTORY', null, {
      root: true,
    }),
  LOAD_CLOSED_CHATS: (context) =>
    context.dispatch('features/chat/closed/LOAD_CLOSED_CHATS', null, {
      root: true,
    }),
};

export default {
  actions,
};
