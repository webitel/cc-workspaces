import ChatHistoryAPI from '@webitel/ui-sdk/src/api/crm/contactChatMessagesHistory';
import { formatChatMessages } from '../scripts/formatChatMessages.js';

const state = {
  chatHistoryMessages: [], // messages from ChatHistoryApi
  page: 1,
  next: false,
};

const actions = {
  LOAD_CHAT_HISTORY: async (context, contactId) => {
    const { items, next } = await ChatHistoryAPI.getAllMessages({ contactId });

    const messages = formatChatMessages(items);// make chat-history messages more similar with current-chat messages

    context.commit('SET_CHAT_HISTORY', messages);
    context.commit('SET_NEXT_STATE', next);
  },
  LOAD_NEXT: async (context, contactId) => {
    if (!context.state.next) return;

    const { items, next } = await ChatHistoryAPI.getAllMessages({ contactId, page: context.state.page });
    const messages = formatChatMessages(items);// make chat-history messages more similar with current-chat messages

    context.commit('SET_CHAT_HISTORY', [...messages, ...context.state.chatHistoryMessages]);
    context.commit('SET_PAGE_STATE', context.state.page + 1);
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
    state.page = 1;
    state.next = false;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
