import WidgetsAPI from '../api/WidgetsAPIRepository';

const state = {
  data: {
    callInbound: 0,
    callHandled: 0,
    callMissed: 0,
    avgHoldSec: 0,
    avgTalkSec: 0,
    occupancy: 0,
    utilization: 0,
    chatAccepts: 0,
    chatAht: 0,
    sumTalkSec: 0,
    processing: 0,
    available: 0,
    voiceMail: 0,
    queueTalkSec: 0,
    taskAccepts: 0,
    scoreCount: 0,
    scoreRequiredAvg: 0,
  },
};

const getters = {
  SCORE_COUNT: (state) => state.data.scoreCount,
  SCORE_REQUIRED_AVG: (state) => state.data.scoreRequiredAvg,
};

const actions = {
  LOAD_WIDGET_DATA: async (context) => {
    const data = await WidgetsAPI.getWidgets();
    context.commit('SET_WIDGET_DATA', data);
  },
};

const mutations = {
  SET_WIDGET_DATA: (state, data) => {
    state.data = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
