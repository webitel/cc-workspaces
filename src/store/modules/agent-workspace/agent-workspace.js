import { destroyCliInstance } from '../../../api/agent-workspace/call-ws-connection';

const state = {
  workspaceState: null,
};

const getters = {};

const actions = {
  OPEN_SESSION: (context) => {
    context.dispatch('now/SET_NOW_WATCHER', null, { root: true });
    context.dispatch('call/SUBSCRIBE_CALLS', null, { root: true });
    context.dispatch('status/SUBSCRIBE_STATUS', null, { root: true });
  },

  CLOSE_SESSION: (context) => {
    context.dispatch('now/CLEAR_NOW_WATCHER', null, { root: true });
    destroyCliInstance();
  },

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
