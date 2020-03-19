import clientHandlers from './client-handlers';
import clientActions from './client-actions';
// import UserStatus from '../../statusUtils/UserStatus';
import { setUserStatus } from '../../../api/agent-workspace/users';

const state = {
  isAgent: false,
  agent: {},
  user: {},
};

const getters = {};

const actions = {
  ...clientHandlers.actions,
  ...clientActions.actions,

  TOGGLE_CCENTER_MODE: async (context) => {
    try {
      if (context.state.isAgent) {
        await context.dispatch('AGENT_LOGOUT');
      } else {
        await context.dispatch('SET_AGENT_WAITING_STATUS');
      }
      context.commit('SET_CCENTER_MODE', !context.state.isAgent);
    } catch (err) {
      throw err;
    }
  },

  SET_USER_ACTIVE_STATUS: async (context) => {
    await setUserStatus('');
    return context;
    // context.commit('SET_USER', {
    //   ...context.state.user,
    //   status: UserStatus.ACTIVE,
    // });
  },

  SET_USER_DND_STATUS: async (context) => {
    await setUserStatus('dnd');
    return context;
    // context.commit('SET_USER', {
    //   ...context.state.user,
    //   status: UserStatus.DND,
    // });
  },
};

const mutations = {
  ...clientHandlers.mutations,

  SET_CCENTER_MODE: (state, value) => {
    state.isAgent = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
