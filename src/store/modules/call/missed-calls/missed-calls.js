import { CallDirection } from 'webitel-sdk';
// eslint-disable-next-line import/no-cycle
import { getAgentHistory } from '../../../../api/agent-workspace/history/history';

const requestParams = {
  size: 100,
  direction: CallDirection.Inbound,
  answeredAt: 0,
  // createdAtFrom: new Date().setHours(0, 0, 0, 0), // today
  createdAtTo: Date.now(),
};

const state = {
  missedList: [],
};

const getters = {
  MISSED_LENGTH: (state) => (state.missedList.length),
};

const actions = {
  LOAD_DATA_LIST: async (context) => {
    const list = await getAgentHistory(requestParams);
    context.commit('SET_DATA_LIST', list);
  },
};

const mutations = {
  SET_DATA_LIST: (state, list) => {
    state.missedList = list;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
