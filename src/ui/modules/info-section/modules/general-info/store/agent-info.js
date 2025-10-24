import AgentPauseCausesAPI from '../../../../../../app/api/agent-workspace/endpoints/agent-info/agent-pause-causes';
import AgentQueuesAPI from '../../../../../../app/api/agent-workspace/endpoints/agent-info/agent-queues';
import AgentStatusAPI from '../../../../../../app/api/agent-workspace/endpoints/agent-info/agent-status';

const state = {
  agent: {},
  pauseCauses: [],
  queues: [],
};

const getters = {
  AGENT_ID: (state, getters, rootState) => rootState.features.status.agent.agentId, // used for initial agent data loading
  IS_DESC_TRACK_AUTH_POPUPS_ALLOW: (state, getters, rootState, rootGetters) => {
    return state.agent?.screenControl 
        && !rootGetters['features/call/CALL_ON_WORKSPACE']
        && !rootGetters['ui/infoSec/processing/ALLOW_PROCESSING']
  },
};

const actions = {
  LOAD_AGENT_INFO: (context) => Promise.allSettled([
    context.dispatch('LOAD_STATUS'),
    context.dispatch('LOAD_PAUSE_CAUSES'),
    context.dispatch('LOAD_QUEUES'),
  ]),
  LOAD_STATUS: async (context) => {
    const agent = await AgentStatusAPI.get({ itemId: context.getters.AGENT_ID });
    context.commit('SET_AGENT', agent);
  },
  LOAD_PAUSE_CAUSES: async (context) => {
    const { items } = await AgentPauseCausesAPI.getList({ agentId: context.getters.AGENT_ID });
    context.commit('SET_PAUSE_CAUSES', items);
    },
  LOAD_QUEUES: async (context) => {
    const params = {
      parentId: context.getters.AGENT_ID,
      size: 100,
      fields: ['queue', 'waiting_members', 'agents', 'max_member_limit'],
    };
    const { items } = await AgentQueuesAPI.getList(params);
    context.commit('SET_QUEUES', items);
    },
};

const mutations = {
  SET_AGENT: (state, agent) => {
    state.agent = agent;
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
