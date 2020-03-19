import getCliInstance from '../../../api/agent-workspace/call-ws-connection';

const actions = {
  SUBSCRIBE_AGENT_STATUS: async (context) => {
    const client = await getCliInstance();
    try {
      const agent = await client.agentSession();
      await agent.listenStatus();
      context.commit('SET_AGENT', agent);
    } catch (err) {
      console.error(err);
    }
  },
};

const mutations = {
  SET_AGENT: (state, agent) => {
    state.agent = agent;
  },
};

export default {
  actions,
  mutations,
};
