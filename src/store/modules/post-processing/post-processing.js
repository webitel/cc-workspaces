const state = {
  isSuccess: true,
  isScheduleCall: true,
  nextDistributeAt: Date.now(),
  categories: [],
  communication: null,
  newCommunications: [],
  description: '',
};

const getters = {};

const actions = {
  SET_PROPERTY: (context, payload) => {
    context.commit('SET_PROPERTY', payload);
  },

  SEND_REPORTING: async (context) => {
    const call = context.rootState.call.callOnWorkspace;
    const reporting = {
      isSuccess: context.state.isSuccess,
      description: context.state.description,
    };
    if (context.state.communication) reporting.communication = context.state.communication;
    if (context.state.isScheduleCall) reporting.nextDistributeAt = context.state.nextDistributeAt;
    console.log(reporting);
    await call.reporting(reporting);
  },

  CHANGE_COMMUNICATION: (context, communication) => {
    context.commit('SET_PROPERTY', { prop: 'communication', value: communication });
  },
};

const mutations = {
  SET_PROPERTY: (state, { prop, value }) => {
    state[prop] = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
