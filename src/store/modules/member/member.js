import { getCliInstance } from '../../../api/agent-workspace/call-ws-connection';
import WorkspaceStates from '../agent-workspace/workspaceUtils/WorkspaceStates';

const state = {
  agent: null,
  membersList: [],
  memberOnWorkspace: {},
  selectedCommId: null,
};

const getters = {
  IS_COMMUNICATION_SELECTED: (state) => (Number.isInteger(state.selectedCommId)),
  MEMBERS_LENGTH: (state) => (state.membersList.length),
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
    context.commit('SET_DATA_LIST', { page, items: response.items });
  },

  OPEN_MEMBER_ON_WORKSPACE: (context, index) => {
    const memberOnWs = context.state.membersList[index];
    context.dispatch('SET_WORKSPACE', memberOnWs);
  },

  SELECT_COMMUNICATION: (context, communication) => {
    context.commit('SET_SELECTED_COMMUNICATION', communication.id);
  },

  CALL: async (context) => {
    const memberId = state.memberOnWorkspace.id;
    const commId = state.selectedCommId;
    const { agent } = context.state;
    await agent.directMember(memberId, commId);
  },

  SET_WORKSPACE: (context, memberOnWs) => {
    context.dispatch('workspace/SET_WORKSPACE_STATE', WorkspaceStates.MEMBER, { root: true });
    context.commit('SET_WORKSPACE', memberOnWs);
  },
};

const mutations = {
  SET_AGENT_INSTANCE: (state, agent) => {
    state.agent = agent;
  },

  SET_DATA_LIST: (state, { page, items }) => {
    if (page === 1) {
      state.membersList = items; // if component is re-rendered, reset persistent storage data
    } else {
      state.membersList = [...state.membersList, ...items];
    }
  },

  SET_SELECTED_COMMUNICATION: (state, commId) => {
    state.selectedCommId = commId;
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
