import AgentPauseCausesAPI from '../../../api/agent-workspace/agent-info/agent-pause-causes';
import AgentStatusAPI from '../../../api/agent-workspace/agent-info/agent-status';
import AgentQueuesAPI from '../../../api/agent-workspace/agent-info/agent-queues';

const state = {
  status: {},
  pauseCauses: [],
  queues: [],
};

const getters = {
  AGENT_ID: (state, getters, rootState) => rootState.status.agent.agentId,
};

const actions = {
  LOAD_AGENT_INFO: (context) => {
    context.dispatch('LOAD_STATUS');
    context.dispatch('LOAD_PAUSE_CAUSES');
    context.dispatch('LOAD_QUEUES');
  },
  LOAD_STATUS: async (context) => {
    const status = await AgentStatusAPI.get({ itemId: context.getters.AGENT_ID });
    context.commit('SET_AGENT_STATUS', status);
  },
  LOAD_PAUSE_CAUSES: async (context) => {
    const { items } = await AgentPauseCausesAPI.getList({ agentId: context.getters.AGENT_ID });
    context.commit('SET_PAUSE_CAUSES', items);
    },
  LOAD_QUEUES: async (context) => {
    const params = {
      parentId: context.getters.AGENT_ID,
      size: 100,
      fields: ['queue', 'waiting_members'],
    };
    const { items } = await AgentQueuesAPI.getList(params);
    context.commit('SET_QUEUES', items);
    },
};

const mutations = {
  SET_AGENT_STATUS: (state, status) => {
    state.status = status;
  },
  SET_PAUSE_CAUSES: (state, pauseCauses) => {
    state.pauseCauses = pauseCauses;
  },
  SET_QUEUES: (state, queues) => {
    state.queues = queues;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
