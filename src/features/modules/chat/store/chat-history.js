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
    console.log('items:', items);

    const messages = items.map((item, index) => {

      console.log('chat.id', item.chat.id, 'item[index - 1]?.chat.id:', item[index-1]?.chat.id);
      const isChatStarted = item[index-1]?.chat.id !== item.chat.id;

      return {
        ...item,
        isChatStarted,
      };
    });

    console.log('messages:', messages);
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
