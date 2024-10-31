import CatalogAPI
  from '../../../../../../app/api/agent-workspace/endpoints/catalog/CatalogAPIRepository.js';
import AgentChatsAPI from '../../../../../../app/api/agent-workspace/endpoints/agent-info/agent-chats.js';
import ChatCloseReason from '../enums/ChatCloseReason.enum';
import { formatChatMessages } from '../../../scripts/formatChatMessages.js';
import applyTransform, { notify } from '@webitel/ui-sdk/src/api/transformers/index.js';
import i18n from '../../../../../../app/locale/i18n.js';

const { t } = i18n.global;

const state = {
  closedChatsList: [],
};

const getters = {
  ACTIVE_CLOSED_CHATS: (state) => ( // closed chats are left in active chats tab
    state.closedChatsList.filter((chat) =>
        chat.closeReason !== ChatCloseReason.AGENT_LEAVE
        && chat.closeReason !== ChatCloseReason.TRANSFER,
      )
  ),
  CLOSED_CHATS: (state) => ( // closed chats for closed chats tab
    state.closedChatsList.filter((chat) =>
        chat.closeReason === ChatCloseReason.TRANSFER
        || chat.closeReason === ChatCloseReason.AGENT_LEAVE,
      )
  ),
  CURRENT_CLOSED_CHAT: (state, getters, rootState, rootGetters) =>
    rootGetters['features/chat/CHAT_ON_WORKSPACE'].closedAt
      ? rootGetters['features/chat/CHAT_ON_WORKSPACE']
      : {},
  CLOSED_CHAT_CONTACT: (state, getters) =>
    getters.CURRENT_CLOSED_CHAT.client?.type === 'contact'
      ? getters.CURRENT_CLOSED_CHAT.client
      : [],
};

const actions = {
  LOAD_CLOSED_CHATS: async (context) => {
    try {
      const items = await AgentChatsAPI.getList({ onlyClosed: true });
      context.commit('SET_CLOSED_CHATS_LIST', items);
    } catch (err) {
      throw applyTransform(err, [
        notify(({ callback }) => callback({
          type: 'error',
          text: t('notifications.closedChatError'),
        })),
      ]);
    }
  },
  OPEN_CLOSED_CHAT: async (context, task) => {
    if (task.contact?.id) { // if chat have contact, we put chat on TASK_ON_WORKSPACE and show chat history (all chats messages) in work-section
      context.dispatch('OPEN_CHAT', task);
    } else {
      const { items } = await CatalogAPI.getChatMessagesList({ chatId: task.id });

      const messages = formatChatMessages(items);
      const chat = { ...task, messages };

      context.dispatch('OPEN_CHAT', chat);
    }
  },
  OPEN_CHAT: (context, chat) => context.dispatch('features/chat/OPEN_CHAT', chat, { root: true }),
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