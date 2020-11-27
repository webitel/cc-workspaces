import clientHandlers from './client-handlers';
import WorkspaceStates from '../agent-workspace/workspaceUtils/WorkspaceStates';

const state = {
  chatList: [],
  chatOnWorkspace: {},
};

const getters = {};

const actions = {
  ...clientHandlers.actions,

  ACCEPT: async (context) => {
    try {
      await context.state.chatOnWorkspace.accept();
    } catch (err) {
      throw err;
    }
  },

  CLOSE: async (context) => {
    const { chatOnWorkspace } = context.state;
    try {
      if (chatOnWorkspace.state === 'active') { // FIXME CHAT STATE ENUM
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

  SET_WORKSPACE: (context, chat) => {
    context.dispatch('workspace/SET_WORKSPACE_STATE', WorkspaceStates.CHAT, { root: true });
    context.commit('SET_WORKSPACE', chat);
  },

  RESET_WORKSPACE: (context) => {
    context.dispatch('workspace/RESET_WORKSPACE_STATE', null, { root: true });
    context.commit('SET_WORKSPACE', {});
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
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
