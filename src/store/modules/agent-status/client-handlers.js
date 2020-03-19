// import { AgentStatus } from 'webitel-sdk';
import getCliInstance from '../../../api/agent-workspace/call-ws-connection';
import UserStatus from '../../statusUtils/UserStatus';
import { getUserStatus } from '../../../api/agent-workspace/users';

const userStatusHandler = (context) => (userArg) => {
  const user = {
    lastStateChange: userArg.timestamp,
  };
  if (userArg.status.includes('dnd')) {
    user.status = UserStatus.DND;
  } else if (userArg.status.includes('wss')) {
    user.status = UserStatus.ACTIVE;
  }
  context.commit('SET_USER_INSTANCE', user);
  console.warn('user status change', userArg);
};

const actions = {
  SUBSCRIBE_STATUS: async (context) => {
    context.dispatch('SUBSCRIBE_AGENT_STATUS');
    context.dispatch('SUBSCRIBE_USER_STATUS');
  },

  SUBSCRIBE_AGENT_STATUS: async (context) => {
    const client = await getCliInstance();
    try {
      const agent = await client.agentSession();
      await agent.listenStatus();
      window.agent = agent;
      context.commit('SET_AGENT_INSTANCE', agent);
    } catch (err) {
      console.error(err);
    }
  },

  SUBSCRIBE_USER_STATUS: async (context) => {
    const client = await getCliInstance();
    try {
      await client.subscribeUsersStatus(userStatusHandler(context));
      await context.dispatch('GET_CURRENT_USER_STATUS');
    } catch (err) {
      console.error(err);
    }
  },

  GET_CURRENT_USER_STATUS: async (context) => {
    try {
      const presence = await getUserStatus();
      let status;
      if (presence.status.includes('dnd')) {
        status = UserStatus.DND;
      } else if (presence.status.includes('wss')) {
        status = UserStatus.ACTIVE;
      }
      const user = {
        status,
        lastStateChange: Date.now(),
      };
      context.commit('SET_USER_INSTANCE', user);
    } catch (err) {
      console.error(err);
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
