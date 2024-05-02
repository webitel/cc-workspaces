import WorkspaceStates from '../../../../../enums/WorkspaceState.enum';

const state = {};

const getters = {
  AGENT_TEAM: (state, getters, rootState) => rootState.features.status.agent?.team, // used for initial flow data loading
  ALLOW_FLOWS: (state, getters, rootState, rootGetters) => (
      rootGetters['features/status/IS_AGENT'] && rootGetters['ui/userinfo/IS_CALL_CENTER_LICENSE']
  ),
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
