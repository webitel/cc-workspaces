const state = {
  workspaceState: null,
};

const getters = {
  TASK_ON_WORKSPACE: (state, getters, rootState) => (
    state.workspaceState
      ? rootState[`${state.workspaceState}`][`${state.workspaceState}OnWorkspace`]
      : {}
  ),

  IS_EMPTY_WORKSPACE: (state) => !state.workspaceState,
};

const actions = {
  OPEN_SESSION: async (context) => {
    try {
      // firstly, try to restore user session
      await context.dispatch('userinfo/OPEN_SESSION', null, { root: true });
      // then, async open workspace session
      context.dispatch('now/SET_NOW_WATCHER', null, { root: true });
      context.dispatch('globals/INIT_GLOBAL_HANDLERS', null, { root: true });
      context.dispatch('call/SUBSCRIBE_CALLS', null, { root: true });
      context.dispatch('chat/INITIALIZE', null, { root: true });
      context.dispatch('status/SUBSCRIBE_STATUS', null, { root: true });
      context.dispatch('call/missed/LOAD_DATA_LIST', null, { root: true });
      context.dispatch('member/LOAD_DATA_LIST', null, { root: true });
    } catch (err) {
      throw err;
    }
  },

  CLOSE_SESSION: async (context) => {
    context.dispatch('now/CLEAR_NOW_WATCHER', null, { root: true });
    await context.rootState.client.destroyCliInstance();
    context.dispatch('globals/RESET_GLOBAL_HANDLERS', null, { root: true });
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
