import { ConversationState } from 'webitel-sdk';
import ChatTransferDestination
  from '../../../enums/ChatTransferDestination.enum';
import WorkspaceStates from '../agent-workspace/workspaceUtils/WorkspaceStates';
import clientHandlers from './client-handlers';

const state = {
  chatList: [],
  chatOnWorkspace: {},
  mediaView: null,
};

const getters = {
  ALLOW_CHAT_TRANSFER: (state) => state.chatOnWorkspace.allowLeave,
  ALLOW_CHAT_JOIN: (state) => state.chatOnWorkspace.allowJoin,
  ALLOW_CHAT_CLOSE: (state) => state.chatOnWorkspace.allowLeave ||
    state.chatOnWorkspace.allowDecline,
  IS_CHAT_ACTIVE: (state) => state.chatOnWorkspace.state ===
    ConversationState.Active,
};

const actions = {
  ...clientHandlers.actions,

  SET_CHAT_LIST: (context, chatList) => {
    context.commit('SET_CHAT_LIST', chatList);
  },

  ADD_CHAT: (context, chat) => {
    context.commit('ADD_CHAT', chat);
  },

  ACCEPT: async (context) => {
    try {
      await context.state.chatOnWorkspace.join();
    } catch (err) {
      throw err;
    }
  },

  SEND: async (context, message) => {
    try {
      await context.state.chatOnWorkspace.send(message);
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
    { chat = context.state.chatOnWorkspace, destination, item },
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
    const { chatOnWorkspace } = context.state;
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

  OPEN_CHAT: (context, chat) => {
    context.dispatch('SET_WORKSPACE', chat);
  },

  CHAT_INSERT_TO_START: (context, chat) => {
    const chatPosition = context.state.chatList.indexOf(chat);
    const chatList = context.state.chatList.slice();
    chatList.splice(chatPosition, 1);
    chatList.unshift(chat);
    context.commit('SET_CHAT_LIST', chatList);
  },

  SET_WORKSPACE: (context, chat) => {
    context.dispatch('workspace/SET_WORKSPACE_STATE', WorkspaceStates.CHAT, { root: true });
    context.commit('SET_WORKSPACE', chat);
  },

  RESET_WORKSPACE: (context) => {
    context.dispatch('workspace/RESET_WORKSPACE_STATE', null, { root: true });
    context.commit('SET_WORKSPACE', {});
  },

  OPEN_MEDIA: (context, message) => {
    context.commit('SET_MEDIA_VIEW', message);
  },

  CLOSE_MEDIA: (context) => {
    context.commit('SET_MEDIA_VIEW', null);
  },
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
  SET_WORKSPACE: (state, chat) => {
    state.chatOnWorkspace = chat;
  },
  SET_MEDIA_VIEW: (state, mediaView) => {
    state.mediaView = mediaView;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
