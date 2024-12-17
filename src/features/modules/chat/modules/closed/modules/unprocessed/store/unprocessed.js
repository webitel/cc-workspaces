import applyTransform, {
  notify,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import AgentChatsAPI
  from '../../../../../../../../app/api/agent-workspace/endpoints/agent-info/agent-chats.js';
import i18n from '../../../../../../../../app/locale/i18n.js';

const { t } = i18n.global;

const state = {
  chatsList: [],
  page: 1,
  size: 6,
  next: false,
};

const getters = {
  REQUEST_PARAMS: (state) => {
    return {
      onlyClosed: true,
      onlyUnprocessed: true,
      page: state.page,
      size: state.size,
    };
  },
};

const actions = {
  LOAD_UNPROCESSED_CHATS: async (context) => {

    try {
      const params = context.state.page > 1
        ? { ...context.getters.REQUEST_PARAMS,
          size: context.state.page * context.state.size, // if page > 1 we need to load all items from all pages https://webitel.atlassian.net/browse/WTEL-5503
          page: 1 }
        : context.getters.REQUEST_PARAMS;

      console.log('load UNPROCESSED page:', context.state.page, 'params:', params);
      const { items, next } = await AgentChatsAPI.getList(params);

      console.log('load UNPROCESSED items', items);
      context.commit('SET_UNPROCESSED_CHATS_LIST', items || []);
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
  UPDATE_UNPROCESSED_CHATS: async (context) => {
    const { items, next } = await AgentChatsAPI.getList({
          ...context.getters.REQUEST_PARAMS,
          size: context.state.page * context.state.size,
          page: 1,
        });
  },
  LOAD_NEXT_UNPROCESSED_CHATS: async (context) => {
    if (!context.state.next) return;
    console.log('NEXT page', context.state.page + 1);
    context.commit('SET_PAGE_STATE', context.state.page + 1);

    const { items, next } = await AgentChatsAPI.getList(context.getters.REQUEST_PARAMS);
    const chatsList = [...context.state.chatsList, ...items];



    context.commit('SET_UNPROCESSED_CHATS_LIST', chatsList);
    context.commit('SET_NEXT_STATE', next);
  },
};

const mutations = {
  SET_UNPROCESSED_CHATS_LIST: (state, chats) => {
    state.chatsList = chats;
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