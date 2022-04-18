import parseUserStatus from './statusUtils/parseUserStatus';
import APIRepository from '../../../app/api/APIRepository';

const usersAPI = APIRepository.users;

const userStatusHandler = (user) => ({
  status: parseUserStatus(user),
});

const actions = {
  // main action to start initialization
  SUBSCRIBE_STATUS: async (context) => {
    context.dispatch('SUBSCRIBE_AGENT_STATUS');
    context.dispatch('SUBSCRIBE_USER_STATUS');
  },

  // main agent subscribe action
  SUBSCRIBE_AGENT_STATUS: async (context) => {
    const client = await context.rootState.client.getCliInstance();
    try {
      const agent = await client.agentSession();

      await client.subscribeAgentsStatus(async (state, agent) => {
        context.commit('SET_AGENT_INSTANCE', agent);
      }, { agent_id: agent.agentId });

      context.commit('SET_AGENT_INSTANCE', agent);

      window.agent = agent;
    } catch (err) {
      throw err;
    }
  },

  // main user subscribe action
  SUBSCRIBE_USER_STATUS: async (context) => {
    const client = await context.rootState.client.getCliInstance();
    try {
      await client.subscribeUsersStatus((presence) => {
        const user = userStatusHandler(presence);
        context.commit('SET_USER_INSTANCE', user);
      });

      await context.dispatch('GET_CURRENT_USER_STATUS');
    } catch (err) {
      throw err;
    }
  },

  // helper action to get initial user status from HTTP request
  GET_CURRENT_USER_STATUS: async (context) => {
    try {
      const presence = await usersAPI.getUserStatus();
      const user = userStatusHandler(presence);
      context.commit('SET_USER_INSTANCE', user);
    } catch (err) {
      throw err;
    }
  },
};

export default {
  actions,
};
