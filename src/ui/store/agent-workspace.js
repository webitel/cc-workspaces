const state = {
  workspaceState: null,
};

const getters = {
  TASK_ON_WORKSPACE: (state, getters, rootState) => (
    state.workspaceState
      ? rootState.features[`${state.workspaceState}`][`${state.workspaceState}OnWorkspace`]
      : {}
  ),

  IS_EMPTY_WORKSPACE: (state) => !state.workspaceState,
};

const actions = {
  OPEN_SESSION: async (context) => {
    try {
      // firstly, try to restore user session
      await context.dispatch('ui/userinfo/OPEN_SESSION', null, { root: true });
      // then, async open workspace session
      context.dispatch('ui/now/SET_NOW_WATCHER', null, { root: true });
      context.dispatch('features/globals/INIT_GLOBAL_HANDLERS', null, { root: true });
      context.dispatch('features/notifications/INIT_NOTIFICATIONS', null, { root: true });
      context.dispatch('features/call/SUBSCRIBE_CALLS', null, { root: true });
      context.dispatch('features/chat/SUBSCRIBE_CHATS', null, { root: true });
      context.dispatch('features/status/SUBSCRIBE_STATUS', null, { root: true });
      context.dispatch('features/call/missed/LOAD_DATA_LIST', null, { root: true });
      context.dispatch('features/member/LOAD_DATA_LIST', null, { root: true });
    } catch (err) {
      throw err;
    }
  },

  CLOSE_SESSION: async (context) => {
    context.dispatch('ui/now/CLEAR_NOW_WATCHER', null, { root: true });
    await context.rootState.client.destroyCliInstance();
    context.dispatch('features/globals/RESET_GLOBAL_HANDLERS', null, { root: true });
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
