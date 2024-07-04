import instance from '../../app/api/instance';
import WorkspaceStates from '../enums/WorkspaceState.enum.js';
import { CallActions, ConversationState } from 'webitel-sdk'

const state = {
  stateHistory: [],
};

const getters = {
  TASK_ON_WORKSPACE: (state) => state.stateHistory.at(-1)?.task || {},
  WORKSRACE_STATE: (state) => state.stateHistory.at(-1)?.type,
  IS_EMPTY_WORKSPACE: (state, getters) => !getters.WORKSRACE_STATE,
  IS_CALL_WORKSPACE: (state,getters) => getters.WORKSRACE_STATE === WorkspaceStates.CALL,
  IS_CHAT_WORKSPACE: (state,getters) => getters.WORKSRACE_STATE === WorkspaceStates.CHAT,
  IS_JOB_WORKSPACE: (state,getters) => getters.WORKSRACE_STATE === WorkspaceStates.JOB,
  IS_TASK_ACTIVE: (state,getters) =>
    getters.TASK_ON_WORKSPACE.state === ConversationState.Active
    || getters.TASK_ON_WORKSPACE.state === CallActions.Active,
};

const actions = {
  OPEN_SESSION: async (context) => {
    try {
      // firstly, try to restore user session
      await context.dispatch('ui/userinfo/OPEN_SESSION', { instance }, { root: true });
      await context.dispatch('features/status/SUBSCRIBE_STATUS', null, { root: true });
      // then, async open workspace session
      return Promise.allSettled(
        [
          context.dispatch('ui/now/SET_NOW_WATCHER', null, { root: true }),
          context.dispatch('features/globals/INIT_GLOBAL_HANDLERS', null, { root: true }),
          context.dispatch('features/notifications/INITIALIZE', null, { root: true }),
          context.dispatch('features/swController/INITIALIZE', null, { root: true }),
          context.dispatch('features/call/SUBSCRIBE_CALLS', null, { root: true }),
          context.dispatch('features/chat/SUBSCRIBE_CHATS', null, { root: true }),
          context.dispatch('features/job/SUBSCRIBE_JOBS', null, { root: true }),
          context.dispatch('features/call/missed/LOAD_DATA_LIST', null, { root: true }),
          context.dispatch('features/call/manual/INITIALIZE_MANUAL_LIST', null, { root: true }),
          context.dispatch('features/chat/manual/INITIALIZE_MANUAL_LIST', null, { root: true }),
          context.dispatch('features/member/LOAD_DATA_LIST', null, { root: true }),
        ],
      );
    } catch (err) {
      throw err;
    }
  },

  CLOSE_SESSION: (context) => Promise
    .allSettled([
                  context.dispatch('ui/now/CLEAR_NOW_WATCHER', null, { root: true }),
                  context.rootState.client.destroyCliInstance(),
                  context.dispatch('features/globals/RESET_GLOBAL_HANDLERS', null, { root: true }),
                  context.dispatch('features/notifications/DESTROY', null, { root: true }),
                ]),

  SET_WORKSPACE_STATE: (context, payload) => {
    context.commit('ADD_WORKSPACE_STATE', payload);
  },
  RESET_WORKSPACE_STATE: (context, config) => {
    let stateHistory = [...context.state.stateHistory];

    /* Filter the history from tasks if this type was previously selected [WTEL-3064]

      When repeatedly clicking on a member in an offline queue,
      the last active event should be displayed in agent-workspace-action panel,
      excluding all offline queues
      */

    if (config) {
      const { type } = config;

      if (type) {
        stateHistory = stateHistory.filter(({ type: typeName }) => type !== typeName);
      }
    }

    while (stateHistory.length) {
      const { type, task } = stateHistory.at(-1);
      if (context.rootState.features[type][`${type}List`].includes(task)) {
        break;
      }
      stateHistory.pop();
    }
    context.commit('SET_STATE_HISTORY', stateHistory);
  },
};

const mutations = {
  SET_STATE_HISTORY: (state, stateHistory) => {
    state.stateHistory = stateHistory;
  },
  ADD_WORKSPACE_STATE: (state, { type, task }) => {
    state.stateHistory.push({ type, task });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
