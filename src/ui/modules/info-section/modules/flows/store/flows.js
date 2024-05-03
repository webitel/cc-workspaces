import FlowsAPI from '../api/flows';

const state = {
  flows: [],
};

const getters = {
  AGENT_TEAM_ID: (state, getters, rootState) => rootState.features.status.agent?.team.id, // used for initial flow data loading
  ALLOW_FLOWS: (state, getters, rootState, rootGetters) => (
      rootGetters['features/status/IS_AGENT'] && rootGetters['ui/userinfo/IS_CALL_CENTER_LICENSE']
  ),
};

const actions = {
  LOAD_FLOWS_LIST: async (context) => {
    const { items } = await FlowsAPI.getLookup({ teamId: context.getters.AGENT_TEAM_ID, enabled: true });
    context.commit('SET_FLOWS', items);
  },
};

const mutations = {
  SET_FLOWS: (state, flows) => {
    state.flows = flows;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {},
};
