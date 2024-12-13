import { ConversationState } from 'webitel-sdk';
import ChatTransferDestination from '../../../ui/modules/work-section/modules/chat/enums/ChatTransferDestination.enum.js';
import WorkspaceStates from '../../../ui/enums/WorkspaceState.enum.js';
import clientHandlers from './client-handlers.js';
import mediaHandlers from './media-handlers.js';
import chatHistory from './chat-history.js';
import manual from './modules/manual/manual.js';
import closed from './modules/closed/closed.js';

const state = {
  chatList: [],
};

const getters = {
  CHAT_ON_WORKSPACE: (s, g, rS, rootGetters) => {
    console.log('in ws:', rootGetters['workspace/IS_CHAT_WORKSPACE'] && rootGetters['workspace/TASK_ON_WORKSPACE'])
    return rootGetters['workspace/IS_CHAT_WORKSPACE'] && rootGetters['workspace/TASK_ON_WORKSPACE']
  }
  ,
  ALL_CHAT_MESSAGES: (state, getters, rootState) => {
    const currentChatMessages = getters.CHAT_ON_WORKSPACE.messages || []; // if chat on workspace didn`t have messages
    console.log('ALL_CHAT_MESSAGES: history:', rootState.features.chat.chatHistory.chatHistoryMessages,
      'current:', currentChatMessages);
    return [...rootState.features.chat.chatHistory.chatHistoryMessages, ...currentChatMessages];
  },
  ALLOW_CHAT_TRANSFER: (state, getters) => getters.CHAT_ON_WORKSPACE.allowLeave && !getters.CHAT_ON_WORKSPACE.closedAt,
  ALLOW_CHAT_JOIN: (state, getters) => getters.CHAT_ON_WORKSPACE.allowJoin,
  ALLOW_CHAT_CLOSE: (state, getters) => getters.CHAT_ON_WORKSPACE.allowLeave || getters.CHAT_ON_WORKSPACE.allowDecline,
  ASK_CHAT_CLOSE: (state, getters) => getters.CHAT_ON_WORKSPACE.allowLeave && !getters.CHAT_ON_WORKSPACE.closedAt,
  IS_CHAT_ACTIVE: (state, getters) => getters.CHAT_ON_WORKSPACE.state === ConversationState.Active,
  IS_MY_MESSAGE: () => (message) => message.member?.self,
};

const actions = {
  ...clientHandlers.actions,
  ...mediaHandlers.actions,

  SET_CHAT_LIST: (context, chatList) => {
    context.commit('SET_CHAT_LIST', chatList);
  },

  ADD_CHAT: (context, chat) => {
    context.commit('ADD_CHAT', chat);
  },

  ACCEPT: async (context) => {
    try {
      await context.getters.CHAT_ON_WORKSPACE.join();
    } catch (err) {
      throw err;
    }
  },

  SEND: async (context, message) => {
    try {
      await context.getters.CHAT_ON_WORKSPACE.send(message);
    } catch (err) {
      throw err;
    }
  },

  SEND_FILE: async (context, files) => {
    try {
      // eslint-disable-next-line no-unused-expressions
      Array.isArray(files)
        ? await Promise.all(files.map((file) => context.dispatch('SEND', file)))
        : await context.dispatch('SEND', files);
    } catch (err) {
      throw err;
    }
  },

  TRANSFER: async (
    context,
    { chat = context.getters.CHAT_ON_WORKSPACE, destination, item },
  ) => {
    if (destination === ChatTransferDestination.USER) {
      return chat.transferToUser(item.id);
    }
    if (destination === ChatTransferDestination.CHATPLAN) {
      return chat.transferToPlan(item.id);
    }
    throw new TypeError('Unknown transfer destination: ', destination);
  },

  CLOSE: async (context) => {
    const chatOnWorkspace = context.getters.CHAT_ON_WORKSPACE;
    try {
      if (chatOnWorkspace.allowLeave) {
        await chatOnWorkspace.leave();
      } else {
        await chatOnWorkspace.decline();
      }
    } catch (err) {
      throw err;
    }
  },

  OPEN_CHAT: async (context, chat) => {
    const isChatClosed = context.state.closed.closedChatsList?.includes(chat);
    if (isChatClosed && !chat.contact) {
      // because default closed chats don't have messages
      await context.dispatch('OPEN_CLOSED_CHAT', chat);
    } else {
      await context.dispatch('SET_WORKSPACE', chat);
      if (chat.contact) await context.dispatch('LOAD_CHAT_HISTORY', chat.contact.id);
    }
  },

  CHAT_INSERT_TO_START: (context, chat) => {
    const chatPosition = context.state.chatList.indexOf(chat);
    const chatList = context.state.chatList.slice();
    chatList.splice(chatPosition, 1);
    chatList.unshift(chat);
    context.commit('SET_CHAT_LIST', chatList);
  },

  LOAD_CHAT_HISTORY: (context, contactId) => context.dispatch('features/chat/chatHistory/LOAD_CHAT_HISTORY', contactId, { root: true }),
  SET_WORKSPACE: (context, chat) => context.dispatch('workspace/SET_WORKSPACE_STATE', { type: WorkspaceStates.CHAT, task: chat }, { root: true }),
  RESET_WORKSPACE: (context) => context.dispatch('workspace/RESET_WORKSPACE_STATE', null, { root: true }),
  _RESET_UNREAD_COUNT: (context) => context.dispatch('features/notifications/_RESET_UNREAD_COUNT', null, { root: true }),
  OPEN_CLOSED_CHAT: (context, chat) => context.dispatch('features/chat/closed/OPEN_CLOSED_CHATS', chat, { root: true }),
};

const mutations = {
  SET_CHAT_LIST: (state, chatList) => {
    state.chatList = chatList;
  },
  ADD_CHAT: (state, chat) => {
    state.chatList.push(chat);
  },
  REMOVE_CHAT: (state, removedChat) => {
    state.chatList = state.chatList.filter((chat) => chat !== removedChat);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {
    manual,
    closed,
    chatHistory,
  },
};
