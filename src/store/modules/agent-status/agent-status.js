import { AgentStatus } from 'webitel-sdk';
import clientHandlers from './client-handlers';
import agentActions from './agent-actions';
import userActions from './user-actions';

const state = {
  agent: {},
  user: {},
};

const getters = {
  IS_AGENT: (state) => state.agent.status !== AgentStatus.Offline,
};

const actions = {
  ...clientHandlers.actions,
  ...agentActions.actions,
  ...userActions.actions,

  TOGGLE_CCENTER_MODE: async (context) => {
    try {
      if (context.getters.IS_AGENT) {
        await context.dispatch('AGENT_LOGOUT');
      } else {
        await context.dispatch('SET_AGENT_WAITING_STATUS');
      }
    } catch (err) {
      throw err;
    }
  },
};

const mutations = {
  ...clientHandlers.mutations,
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
