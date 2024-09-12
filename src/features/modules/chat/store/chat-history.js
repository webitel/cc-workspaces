import ChatHistoryAPI from '@webitel/ui-sdk/src/api/crm/contactChatMessagesHistory';

const state = {
  chatHistoryMessages: [], // messages from ChatHistoryApi
  next: false,
};

const getters = {
  ALL_CONTACTS_MESSAGES: (state, getters, rootState, rootGetters) => (
    [...state.chatHistoryMessages, ...rootGetters['features/chat/CHAT_ON_WORKSPACE']?.messages]
  ), // chat history messages + current chat messages
};

const actions = {
  LOAD_CHAT_HISTORY: async (context, contactId) => {
    const { items } = await ChatHistoryAPI.getAllMessages({ id: contactId });

    const messages = items.map((item, index, array) => {

      const isChatStarted = array[index-1] // it means first downloaded message in history
        && array[index-1]?.chat?.id !== item.chat?.id // messages from different chats
        || !array[index+1]; // it means last message in history after this started current chat messages

      const isChatEnded = isChatStarted || !context.rootGetters['features/chat/CHAT_ON_WORKSPACE']?.messages.length

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
