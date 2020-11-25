import clientHandlers from './client-handlers';

const state = {
  chatList: [],
  chatOnWorkspace: {},
};

const getters = {};

const actions = {
  ...clientHandlers.actions,

  RESET_WORKSPACE: () => {},
};

const mutations = {
  SET_CHAT_LIST: (state, chatList) => {
    state.chatList = chatList;
  },
  ADD_CHAT: (state, chat) => {
    state.chatList.push(chat);
  },
  REMOVE_CHAT: (state, removedChat) => {
    state.callList = state.callList.filter((call) => call !== removedChat);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
