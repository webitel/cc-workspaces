const state = {
  isSuccess: true,
  isScheduleCall: true,
  nextDistributeAt: Date.now(),
  categories: [],
  communications: [],
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
      // categories: context.state.categories,
      // communications: context.state.communications,
    };
    if (context.state.isScheduleCall) reporting.nextDistributeAt = context.state.nextDistributeAt;
    try {
      await call.reporting(reporting);
    } catch (e) {
      console.log(e);
    }
    console.log('sent reporting');
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
