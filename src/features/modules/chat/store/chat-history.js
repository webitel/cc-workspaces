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

    const messages = items.map((item, index, array) => {

      const isChatStarted = array[index-1] // it means first(on top) downloaded message in history
        && array[index-1]?.chat?.id !== item.chat?.id // messages from different chats
        || !array[index+1] && context.getters.CURRENT_CHAT_MESSAGES.length; // it means last message in history and after this started current chat messages

      const isChatEnded = isChatStarted || !context.getters.CURRENT_CHAT_MESSAGES.length

      return {
        ...item,
        isChatStarted,
        isChatEnded,
      };
    });
    context.commit('SET_CHAT_HISTORY', messages);
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
