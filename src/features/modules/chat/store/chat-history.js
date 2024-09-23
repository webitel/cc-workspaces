import ChatHistoryAPI from '@webitel/ui-sdk/src/api/crm/contactChatMessagesHistory';

const state = {
  chatHistoryMessages: [], // messages from ChatHistoryApi
  next: false,
};

const getFile = (file) => { // because we don`t get message fileURL from chat-history data
  if (!file) return null;
  const token = localStorage.getItem('access-token');
  const url = file.url || `${import.meta.env.VITE_API_URL}/storage/file/${file.id}/download?access_token=${token}`;

  return {
    ...file,
    url,
  }
};

const actions = {
  LOAD_CHAT_HISTORY: async (context, contactId) => {
    const { items } = await ChatHistoryAPI.getAllMessages({ id: contactId });

    const messages = items.map((item) => ({
      ...item,
      file: getFile(item.file), // because we don`t get fileURL from chat-history data
    }));

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
