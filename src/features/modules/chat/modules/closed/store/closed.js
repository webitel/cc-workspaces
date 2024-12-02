import AgentChatsAPI from '../../../../../../app/api/agent-workspace/endpoints/agent-info/agent-chats.js';
import applyTransform, { notify } from '@webitel/ui-sdk/src/api/transformers/index.js';
import i18n from '../../../../../../app/locale/i18n.js';

const { t } = i18n.global;

const state = {
  closedChatsList: [],
  page: 1,
  next: false,
};

const getters = {
  REQUEST_PARAMS: (state) => {
    return {
      onlyClosed: true,
      page: state.page,
    };
  },
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
      const { items, next } = await AgentChatsAPI.getList(context.getters.REQUEST_PARAMS);

      context.commit('SET_CLOSED_CHATS_LIST', items || []);
      context.commit('SET_NEXT_STATE', next);

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
  LOAD_NEXT_CHATS: async (context) => {
    if (!context.state.next) return;
    context.commit('SET_PAGE_STATE', context.state.page + 1);

    const { items, next } = await AgentChatsAPI.getList(context.getters.REQUEST_PARAMS);
    const chatsList = [...context.state.closedChatsList, ...items];

    context.commit('SET_CLOSED_CHATS_LIST', chatsList);
    context.commit('SET_NEXT_STATE', next);
  },
};

const mutations = {
  SET_CLOSED_CHATS_LIST: (state, chats) => {
    state.closedChatsList = chats;
  },
  SET_PAGE_STATE: (state, page) => {
    state.page = page;
  },
  SET_NEXT_STATE: (state, next) => {
    state.next = next;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
