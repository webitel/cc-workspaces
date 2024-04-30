const state = {};

const getters = {
  AGENT_TEAM: (state, getters, rootState) => rootState.features.status.agent?.team, // used for initial flow data loading
};

const actions = {};

const mutations = {
};

// empty store for future usage

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {},
};
