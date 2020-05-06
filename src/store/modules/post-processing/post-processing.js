
import deepEqual from 'deep-equal';

const defaultState = () => ({
  isSuccess: true,
  isScheduleCall: true,
  nextDistributeAt: Date.now(),
  categories: [],
  communication: {},
  newCommunications: [],
  description: '',
});

const state = {
  ...defaultState(),
};

const getters = {};

const actions = {
  SET_PROPERTY: (context, payload) => {
    context.commit('SET_PROPERTY', payload);
  },

  SEND_REPORTING: (context) => {
    const call = context.rootState.call.callOnWorkspace;
    const reporting = {
      success: context.state.isSuccess,
      description: context.state.description,
    };
    const { communication } = context.state;
    const isCommunicationChanged = !deepEqual(call.memberCommunication, communication);
    if (isCommunicationChanged) reporting.communication = communication;
    if (context.state.newCommunications.length) {
      reporting.new_communications = context.state.newCommunications;
    }
    if (context.state.isScheduleCall) reporting.next_distribute_at = context.state.nextDistributeAt;
    call.reporting(reporting);
  },

  SET_COMMUNICATION: (context, communication) => {
    context.commit('SET_PROPERTY', { prop: 'communication', value: communication });
  },

  ADD_NEW_COMMUNICATION: (context) => {
    context.commit('ADD_NEW_COMMUNICATION');
  },

  CHANGE_NEW_COMMUNICATION: (context, { value, index }) => {
    context.commit('CHANGE_NEW_COMMUNICATION', { value, index });
  },

  DELETE_NEW_COMMUNICATION: (context, index) => {
    context.commit('DELETE_NEW_COMMUNICATION', index);
  },

  RESET_STATE: (context) => {
    context.commit('RESET_STATE');
  },
};

const mutations = {
  SET_PROPERTY: (state, { prop, value }) => {
    state[prop] = value;
  },

  ADD_NEW_COMMUNICATION: (state) => {
    state.newCommunications.push({});
  },

  CHANGE_NEW_COMMUNICATION: (state, { value, index }) => {
    // splice triggers reactive recomputing, when simple assigning [index] = value -- not
    state.newCommunications.splice(index, 1, value);
  },

  DELETE_NEW_COMMUNICATION: (state, index) => {
    state.newCommunications.splice(index, 1);
  },

  RESET_STATE: (state) => {
    Object.assign(state, defaultState());
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
