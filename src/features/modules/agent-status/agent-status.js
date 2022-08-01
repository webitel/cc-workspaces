import { AgentStatus } from 'webitel-sdk';
import clientHandlers from './client-handlers';
import APIRepository from '../../../app/api/APIRepository';
import UserStatus from './statusUtils/UserStatus';

const usersAPI = APIRepository.users;

const state = {
  agent: {},
  user: { status: {} },
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

  TOGGLE_USER_DND: async (context) => {
    const status = context.state.user.status?.[UserStatus.DND] ? '' : UserStatus.DND;
    await usersAPI.setUserStatus(status);
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
  SET_AGENT_INSTANCE: (state, agent) => {
    state.agent = agent;
  },

  SET_USER_INSTANCE: (state, user) => {
    state.user = user;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
