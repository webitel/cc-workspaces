import { CallDirection } from 'webitel-sdk';
import missedAPI from '../api/missed';

const state = {
  missedList: [],
  page: 1,
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

  // check if passed call is missed
  IS_CALL_MISSED: () => (call) => call.direction === CallDirection.Inbound && !call.answeredAt,
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
      return context.dispatch('INITIALIZE_MISSED');
    } catch (err) {
      throw err;
    }
  },

  HIDE_MISSED: async (context, missed) => {
    try {
      await missedAPI.hideMissedCall({ callId: missed.id });
      return context.dispatch('INITIALIZE_MISSED');
    } catch (err) {
      throw err;
    }
  },

  RESET_MISSED_LIST: (context) => {
    context.commit('SET_DATA_LIST', []);
    context.commit('SET_PAGE', 0);
  },

  INITIALIZE_MISSED: async (context) => {
    await context.dispatch('RESET_MISSED_LIST');
    return context.dispatch('LOAD_DATA_LIST');
  },

  ON_CALL_MISS: async (context) => {
    setTimeout(() => context.dispatch('INITIALIZE_MISSED'), 3000);
  },
};

const mutations = {
  SET_DATA_LIST: (state, list) => {
    state.missedList = list;
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
