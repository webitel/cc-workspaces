import missedAPI from '../api/missed';

const state = {
  isNewMissed: false, // UI flag
  missedList: [],
  page: 0,
  next: false,
};

const getters = {
  REQUEST_PARAMS: (state, g, rootState) => {
    const { userId } = rootState.ui.userinfo;
    return {
      userId,
      size: 10,
      page: state.page,
    };
  },
  MISSED_LENGTH: (state) => (state.missedList.length),
};

const actions = {
  LOAD_DATA_LIST: async (context) => {
    const { items, next } = await missedAPI.getMissedCalls(context.getters.REQUEST_PARAMS);
    context.commit('SET_NEXT', next);
    context.commit('SET_DATA_LIST', items);
  },

  LOAD_NEXT_PAGE: async (context) => {
    context.commit('SET_PAGE', context.state.page + 1);

    const { items, next } = await missedAPI.getMissedCalls(context.getters.REQUEST_PARAMS);
    context.commit('SET_NEXT', next);
    context.commit('SET_DATA_LIST', [...context.state.missedList, ...items]);
  },

  REDIAL: async (context, missed) => {
    try {
      await missedAPI.redialToMissed({ callId: missed.id });
      context.commit('REMOVE_HIDDEN_MISSED_FROM_LIST', missed);
    } catch (err) {
      throw err;
    }
  },

  HIDE_MISSED: async (context, missed) => {
    try {
      await missedAPI.hideMissedCall({ callId: missed.id });
      context.commit('REMOVE_HIDDEN_MISSED_FROM_LIST', missed);
    } catch (err) {
      throw err;
    }
  },

  RESET_MISSED_LIST: (context) => {
    context.commit('SET_DATA_LIST', []);
    context.commit('SET_PAGE', 0);
  },

  PUSH_MISSED_STUB: (context, { from = {} }) => {
    context.commit('PUSH_SINGLE_MISSED', { from, createdAt: Date.now() });
    context.commit('SET_NEW_MISSED');
  },

  RESET_NEW_MISSED: (context) => {
    context.commit('RESET_NEW_MISSED');
  },
};

const mutations = {
  SET_DATA_LIST: (state, list) => {
    state.missedList = list;
  },

  PUSH_SINGLE_MISSED: (state, missed) => {
    state.missedList.push(missed);
  },

  SET_NEW_MISSED: (state) => {
    state.isNewMissed = true;
  },

  REMOVE_HIDDEN_MISSED_FROM_LIST: (state, missed) => {
    state.missedList.splice(state.missedList.indexOf(missed), 1);
  },

  RESET_NEW_MISSED: (state) => {
    state.isNewMissed = false;
  },

  SET_PAGE: (state, page) => {
    state.page = page;
  },

  SET_NEXT: (state, next) => {
    state.next = next;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
