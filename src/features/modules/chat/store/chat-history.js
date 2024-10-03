import ChatHistoryAPI from '@webitel/ui-sdk/src/api/crm/contactChatMessagesHistory';
import { formatChatMessages } from '../scripts/formatChatMessages.js';

const state = {
  chatHistoryMessages: [], // messages from ChatHistoryApi
  page: 1,
  next: false,
};

const getters = {
  CONTACT_ID: (state, getters, rootState) => rootState['ui/infoSec/client/contact/contact'].id,
}

const actions = {
  LOAD_CHAT_HISTORY: async (context, contactId) => {
    const { items } = await ChatHistoryAPI.getAllMessages({ id: contactId });

    const messages = formatChatMessages(items);// make chat-history messages more similar with current-chat messages
    context.commit('SET_CHAT_HISTORY', messages);
  },
  LOAD_NEXT: async (context) => {
    if (!context.state.next) return;
    context.commit('SET_PAGE_STATE', context.state.page + 1);
    const { items, next } = await ChatHistoryAPI.getAllMessages({ id: context.getters.CONTACT_ID });
    // тут ці items варто обробляти
    context.commit('SET_CHAT_HISTORY', [...context.state.chatHistoryMessages, ...items]);
    context.commit('SET_NEXT_STATE', next);
  },
  RESET_CHAT_HISTORY: (context) => {
    context.commit('RESET_CHAT_HISTORY_STATE');
  },
};

const mutations = {
  SET_CHAT_HISTORY: (state, messages) => {
    state.chatHistoryMessages = messages;
  },
  SET_NEXT_STATE: (state, value) => {
    state.next = value;
  },
  SET_PAGE_STATE: (state, value) => {
    state.page = value;
  },
  RESET_CHAT_HISTORY_STATE: (state) => {
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
