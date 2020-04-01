import getCliInstance from '../../../../api/agent-workspace/call-ws-connection';

const state = {
  agent: null,
  membersList: [],
  memberOnWorkspace: {},
};

const getters = {
  IS_MEMBER_ON_WORKSPACE: (state) => (Object.keys(state.memberOnWorkspace).length),
};

const actions = {
  GET_AGENT_INSTANCE: async (context) => {
    const client = await getCliInstance();
    const agent = await client.agentSession();
    context.commit('SET_AGENT_INSTANCE', agent);
    return agent;
  },

  LOAD_DATA_LIST: async (context, { page = 1, size = 20, search = '' }) => {
    const agent = context.state.agent
      ? context.state.agent : await context.dispatch('GET_AGENT_INSTANCE');
    const response = await agent.offlineMembers(search, page, size);
    context.commit('SET_DATA_LIST', response.items);
  },

  OPEN_MEMBER_ON_WORKSPACE: (context, index) => {
    const memberOnWs = context.state.membersList[index];
    context.commit('SET_WORKSPACE', memberOnWs);
  },
};

const mutations = {
  SET_AGENT_INSTANCE: (state, agent) => {
    state.agent = agent;
  },

  SET_DATA_LIST: (state, list) => {
    state.membersList = list;
  },

  SET_WORKSPACE: (state, member) => {
    state.memberOnWorkspace = member;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
