import ChatHistoryAPI from '@webitel/ui-sdk/src/api/crm/contactChatMessagesHistory';
import { formatChatMessages } from '../scripts/formatChatMessages.js';

const state = {
  chatHistoryMessages: [], // messages from ChatHistoryApi
  next: false,
};

const actions = {
  LOAD_CHAT_HISTORY: async (context, contactId) => {
    const { items } = await ChatHistoryAPI.getAllMessages({ id: contactId });

    const messages = formatChatMessages(items);// make chat-history messages more similar with current-chat messages
    context.commit('SET_CHAT_HISTORY', messages);
  },
  RESET_CHAT_HISTORY: (context) => {
    context.commit('RESET_CHAT_HISTORY');
  }
};

const mutations = {
  SET_CHAT_HISTORY: (state, messages) => {
    state.chatHistoryMessages = messages;
  },
  RESET_CHAT_HISTORY: (state) => {
    state.chatHistoryMessages = [];
    state.next = false;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
