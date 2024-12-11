import AgentChatsAPI from '../../../../../app/api/agent-workspace/endpoints/agent-info/agent-chats.js';
import applyTransform, { notify } from '@webitel/ui-sdk/src/api/transformers/index.js';
import CatalogAPI
  from '../../../../../app/api/agent-workspace/endpoints/catalog/CatalogAPIRepository.js';
import i18n from '../../../../../app/locale/i18n.js';
import { formatChatMessages } from '../../scripts/formatChatMessages.js';

const { t } = i18n.global;

const state = {
  closedChatsList: [],
};

const getters = {
  IS_CHAT_ON_WORKSPACE_CLOSED: (state, getters, rootState, rootGetters) => (
    !!rootGetters['features/chat/CHAT_ON_WORKSPACE'].closedAt
  ),
  UNPROCESSED_CLOSED_CHATS: (state) => ( // closed chats are left in active chats tab unprocessed
    state.closedChatsList.filter((chat) => chat?.unprocessedClose)
  ),
  CLOSED_CHATS: (state) => ( // closed chats for closed chats tab
    state.closedChatsList.filter((chat) => !chat?.unprocessedClose)
  ),
};

const actions = {
  LOAD_CLOSED_CHATS: async (context) => {
    try {
      const { items } = await AgentChatsAPI.getList({ onlyClosed: true });
      context.commit('SET_CLOSED_CHATS_LIST', items || []);
    } catch (err) {
      throw applyTransform(err, [
        notify(({ callback }) => callback({
          type: 'error',
          text: t('notifications.closedChatError'),
        })),
      ]);
    }
  },
  MARK_AS_PROCESSED: async (context, chat) => {
    await AgentChatsAPI.markChatProcessed(chat.id);
    await context.dispatch('LOAD_CLOSED_CHATS');
  },
  OPEN_CLOSED_CHAT: async (context, chat) => {
    if (!chat.messages) {
      const { items: messages } = await CatalogAPI.getChatMessagesList({ chatId: chat.id });

      // wtf? – https://webitel.atlassian.net/browse/WTEL-5515?focusedCommentId=641895
      chat.messages = formatChatMessages(messages);
    }
  await context.dispatch('SET_WORKSPACE', chat);
},
};

const mutations = {
  SET_CLOSED_CHATS_LIST: (state, chats) => {
    state.closedChatsList = chats;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
