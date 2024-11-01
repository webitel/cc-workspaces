import CatalogAPI
  from '../../../../../../app/api/agent-workspace/endpoints/catalog/CatalogAPIRepository.js';
import AgentChatsAPI from '../../../../../../app/api/agent-workspace/endpoints/agent-info/agent-chats.js';
import { formatChatMessages } from '../../../scripts/formatChatMessages.js';
import applyTransform, { notify } from '@webitel/ui-sdk/src/api/transformers/index.js';
import i18n from '../../../../../../app/locale/i18n.js';

const { t } = i18n.global;

const state = {
  closedChatsList: [],
};

const getters = {
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
      const items = await AgentChatsAPI.getList({ onlyClosed: true });
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
  OPEN_CLOSED_CHAT: async (context, task) => {
    if (task.contact?.id) { // if chat have contact, we put chat on TASK_ON_WORKSPACE and show chat history (all chats messages) in work-section
      context.dispatch('OPEN_CHAT', task);
    } else { // if chat don`t have contact, we need to get messages for closed chat
      const { items } = await CatalogAPI.getChatMessagesList({ chatId: task.id });

      const messages = formatChatMessages(items);
      const chat = { ...task, messages };

      context.dispatch('OPEN_CHAT', chat);
    }
  },
  MARK_AS_PROCESSED: async (context, { chatId }) => {
    await AgentChatsAPI.markChatProcessed(chatId);
    await context.dispatch('LOAD_CLOSED_CHATS');
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
