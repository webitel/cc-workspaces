import { ConversationState } from 'webitel-sdk';
import WorkspaceStates from '../agent-workspace/workspaceUtils/WorkspaceStates';
import Reporting from '../post-processing/Reporting';
import clientHandlers from './client-handlers';

const state = {
  chatList: [],
  chatOnWorkspace: {},
  mediaView: null,
  documentTitle: null,
  unreadCount: 0,
};

const getters = {
  ALLOW_CHAT_JOIN: (state) => state.chatOnWorkspace.allowJoin,
  ALLOW_CHAT_CLOSE: (state) => state.chatOnWorkspace.allowLeave || state.chatOnWorkspace.allowDecline,
  IS_CHAT_ACTIVE: (state) => state.chatOnWorkspace.state === ConversationState.Active,
  IS_MY_MESSAGE: (state) => (message) => message.member?.self,
};

const actions = {
  ...clientHandlers.actions,

  INITIALIZE: (context) => {
    context.dispatch('SUBSCRIBE_CHATS');
    context.dispatch('INIT_TAB_TITLE');
  },

  SET_CHAT_LIST: (context, chatList) => {
    chatList.forEach((chat) => {
      if (chat.hasReporting) {
        // eslint-disable-next-line no-param-reassign
        chat.postProcessData = new Reporting(chat);
      }
    });
    context.commit('SET_CHAT_LIST', chatList);
  },

  ADD_CHAT: (context, chat) => {
    if (chat.hasReporting) {
      // eslint-disable-next-line no-param-reassign
      chat.postProcessData = new Reporting(chat);
    }
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
  INIT_TAB_TITLE: (context) => {
    context.commit('INIT_TAB_TITLE', document.title);
    context.dispatch('RESET_NOTIFICATIONS_COUNT');
  },

  INCREMENT_NOTIFICATIONS_COUNT: (context) => {
    const count = context.state.unreadCount + 1;
    context.dispatch('SET_NOTIFICATIONS_COUNT', count);
  },

  RESET_NOTIFICATIONS_COUNT: (context) => {
    context.dispatch('SET_NOTIFICATIONS_COUNT', 0);
  },

  SET_NOTIFICATIONS_COUNT: (context, count) => {
    context.commit('SET_NOTIFICATIONS_COUNT', count);
    context.dispatch('SET_TAB_TITLE');
  },

  SET_TAB_TITLE: (context) => {
    const count = context.state.unreadCount;
    const docTitle = context.state.documentTitle;
    document.title = count ? `(${count}) ${docTitle}` : docTitle;
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
  INIT_TAB_TITLE: (state, title) => {
    state.documentTitle = title;
  },
  SET_NOTIFICATIONS_COUNT: (state, count) => {
    state.unreadCount = count;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
