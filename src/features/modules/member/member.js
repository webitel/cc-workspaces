import WorkspaceStates from '../../../ui/enums/WorkspaceState.enum';

const state = {
  agent: null,
  memberList: [],
  memberOnWorkspace: {},
  selectedCommId: null,
};

const getters = {
  MEMBER_ON_WORKSPACE: (s, g, rS, rootGetters) => (
    rootGetters['workspace/WORKSRACE_STATE'] === WorkspaceStates.MEMBER && rootGetters['workspace/TASK_ON_WORKSPACE']
  ),
  IS_COMMUNICATION_SELECTED: (state) => (Number.isInteger(state.selectedCommId)),
};

const actions = {
  GET_AGENT_INSTANCE: async (context) => {
    const client = await context.rootState.client.getCliInstance();
    const agent = await client.agentSession();
    context.commit('SET_AGENT_INSTANCE', agent);
    return agent;
  },

  LOAD_DATA_LIST: async (context, payload) => {
    const page = payload?.page || 1;
    const size = payload?.size || 20;
    const search = payload?.search || '';
    const agent = context.state.agent
      ? context.state.agent : await context.dispatch('GET_AGENT_INSTANCE');
    const response = await agent.offlineMembers(search, page, size);
    context.commit('SET_DATA_LIST', { page, items: response.items });
  },

  OPEN_MEMBER_ON_WORKSPACE: (context, member) => {
    return context.dispatch('SET_WORKSPACE', member);
  },

  SELECT_COMMUNICATION: (context, communication) => {
    context.commit('SET_SELECTED_COMMUNICATION', communication.id);
  },

  CALL: async (context) => {
    const memberId = context.getters.MEMBER_ON_WORKSPACE.id;
    const commId = state.selectedCommId;
    const { agent } = context.state;
    await agent.directMember(memberId, commId);
    return context.dispatch('LOAD_DATA_LIST');
  },

  SET_WORKSPACE: (context, memberOnWs) => {
    context.dispatch('workspace/SET_WORKSPACE_STATE', { type: WorkspaceStates.MEMBER, task: memberOnWs }, { root: true });
  },
};

const mutations = {
  SET_AGENT_INSTANCE: (state, agent) => {
    state.agent = agent;
  },

  SET_DATA_LIST: (state, { page, items }) => {
    if (page === 1) {
      state.memberList = items; // if component is re-rendered, reset persistent storage data
    } else {
      state.memberList = [...state.memberList, ...items];
    }
  },

  SET_SELECTED_COMMUNICATION: (state, commId) => {
    state.selectedCommId = commId;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
