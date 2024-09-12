import ChatHistoryAPI from '@webitel/ui-sdk/src/api/crm/contactChatMessagesHistory';

const state = {
  chatHistoryMessages: [], // messages from ChatHistoryApi
  next: false,
};

const getters = {
  CURRENT_CHAT_MESSAGES: (state, getters, rootState, rootGetters) => rootGetters['features/chat/CHAT_ON_WORKSPACE']?.messages,
  ALL_CONTACTS_MESSAGES: (state, getters) => (
    [...state.chatHistoryMessages, ...getters.CURRENT_CHAT_MESSAGES]
  ), // chat history messages + current chat messages
};

const actions = {
  LOAD_CHAT_HISTORY: async (context, contactId) => {
    const { items } = await ChatHistoryAPI.getAllMessages({ id: contactId });
    context.commit('SET_CHAT_HISTORY', items);
  },
};

const mutations = {
  SET_CHAT_HISTORY: (state, messages) => {
    state.chatHistoryMessages = messages;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
