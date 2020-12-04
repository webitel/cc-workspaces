import { AgentStatus } from 'webitel-sdk';
import clientHandlers from './client-handlers';
import APIRepository from '../../../api/APIRepository';

const usersAPI = APIRepository.users;

const state = {
  agent: {},
  user: {},
};

const getters = {
  IS_AGENT: (state) => state.agent.status !== AgentStatus.Offline,
};

const actions = {
  ...clientHandlers.actions,

  SET_AGENT_WAITING_STATUS: (context) => {
    try {
      context.state.agent.online();
    } catch {
    }
  },

  SET_AGENT_PAUSE_STATUS: (context, note = '') => {
    try {
      context.state.agent.pause(note);
    } catch {
    }
  },

  AGENT_LOGOUT: (context) => {
    try {
      context.state.agent.offline();
    } catch {
    }
  },

  SET_USER_ACTIVE_STATUS: async () => {
    await usersAPI.setUserStatus('');
  },

  SET_USER_DND_STATUS: async () => {
    await usersAPI.setUserStatus('dnd');
  },

  TOGGLE_CONTACT_CENTER_MODE: async (context) => {
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
