import { CallDirection } from 'webitel-sdk';
import APIRepository from '../../../../api/APIRepository';

const historyAPI = APIRepository.history;

const requestParams = {
  size: 100,
  direction: CallDirection.Inbound,
  answeredAtFrom: 0,
  answeredAtTo: 0,
  createdAtFrom: new Date().setHours(0, 0, 0, 0), // today
  createdAtTo: new Date().setHours(23, 59, 59, 999), // today end
  fields: ['from', 'created_at'],
  isMissed: true,
};

const state = {
  isNewMissed: false, // UI flag
  missedList: [],
};

const getters = {
  MISSED_LENGTH: (state) => (state.missedList.length),
};

const actions = {
  LOAD_DATA_LIST: async (context) => {
    const { userId } = context.rootState.userinfo;
    const params = {
      ...requestParams,
      userId,
    };
    const response = await historyAPI.getHistory(params);
    context.commit('SET_DATA_LIST', response.items);
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

  RESET_NEW_MISSED: (state) => {
    state.isNewMissed = false;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
