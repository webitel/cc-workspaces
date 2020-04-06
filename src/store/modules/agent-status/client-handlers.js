import getCliInstance from '../../../api/agent-workspace/call-ws-connection';
import { getUserStatus, parseUserStatus } from '../../../api/agent-workspace/users/users';

const userStatusHandler = (context) => (userArg) => {
  const user = {
    status: parseUserStatus(userArg),
    lastStateChange: Date.now(),
  };

  context.commit('SET_USER_INSTANCE', user);
};

const actions = {
  // main action to start initialization
  SUBSCRIBE_STATUS: async (context) => {
    context.dispatch('SUBSCRIBE_AGENT_STATUS');
    context.dispatch('SUBSCRIBE_USER_STATUS');
  },

  // main agent subscribe action
  SUBSCRIBE_AGENT_STATUS: async (context) => {
    const client = await getCliInstance();
    try {
      const agent = await client.agentSession();
      await agent.listenStatus();
      context.commit('SET_AGENT_INSTANCE', agent);

      window.agent = agent;
    } catch (err) {
      throw err;
    }
  },

  // main user subscribe action
  SUBSCRIBE_USER_STATUS: async (context) => {
    const client = await getCliInstance();
    try {
      await client.subscribeUsersStatus(userStatusHandler(context));
      await context.dispatch('GET_CURRENT_USER_STATUS');
    } catch (err) {
      throw err;
    }
  },

  // helper action to get initial user status from HTTP request
  GET_CURRENT_USER_STATUS: async (context) => {
    try {
      const presence = await getUserStatus();
      const user = {
        status: parseUserStatus(presence),
        lastStateChange: Date.now(),
      };
      context.commit('SET_USER_INSTANCE', user);
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
  actions,
  mutations,
};
