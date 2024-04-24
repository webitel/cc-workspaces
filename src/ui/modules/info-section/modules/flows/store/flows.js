import FlowsAPI from '../api/flows.js';

const state = {
  flows: [],
  isLoading: false,
};

const getters = {
  AGENT: (state, getters, rootState) => rootState.features.status.agent,
  // ALLOW_PROCESSING: (s, g, rS, rootGetters) => rootGetters['workspace/TASK_ON_WORKSPACE'].allowReporting,
};

const actions = {
  // LOAD_LIST: async (context, teamId) => {
  //   console.log('flow store agent:', context.getters.AGENT);
  //   try {
  //     context.commit('SET_IS_LOADING', true);
  //     const flowsList = await FlowsAPI.getList({ teamId });
  //     context.commit('SET_LIST', flowsList);
  //   } finally {
  //     context.commit('SET_IS_LOADING', false);
  //   }
  // },
};

const mutations = {
  // SET_IS_LOADING: (state, value) => {
  //   state.isLoading = value;
  // },
  // SET_LIST: (state, flowsList) => {
  //   state.flows = flowsList;
  // },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {},
};
