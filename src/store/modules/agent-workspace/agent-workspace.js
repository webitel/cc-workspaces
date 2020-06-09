
const state = {
  workspaceState: null,
};

const getters = {};

const actions = {
  SET_WORKSPACE_STATE: (context, wsState) => {
    context.commit('SET_WORKSPACE_STATE', wsState);
  },
  RESET_WORKSPACE_STATE: (context) => {
    context.commit('SET_WORKSPACE_STATE', null);
  },
};

const mutations = {
  SET_WORKSPACE_STATE: (state, wsState) => {
    state.workspaceState = wsState;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
