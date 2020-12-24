const defaultState = () => ({
  isSuccess: true,
  description: '',
  isScheduleCall: true,
  nextDistributeAt: Date.now(),
  communicationsList: [],
  nextCommunication: null,

  isNewCommunication: false,
  editedCommunication: null,
});

const state = {
  ...defaultState(),
};

const getters = {
  IS_MEMBER: (state, getters, rootState, rootGetters) => rootGetters['workspace/TASK_ON_WORKSPACE'].isMember,
  IS_COMMUNICATION_POPUP: (state) => state.isNewCommunication || state.editedCommunication,
};

const actions = {
  SEND_REPORTING: (context) => {
    const task = context.rootGetters['workspace/TASK_ON_WORKSPACE'];
    const reporting = {
      success: context.state.isSuccess,
      description: context.state.description,
    };
    if (context.getters.IS_MEMBER) {
      reporting.communications = context.state.communicationsList;
      reporting.nextCommunication = context.state.nextCommunication;
    }
    if (context.state.isScheduleCall) {
      reporting.nextDistributeAt = context.state.nextDistributeAt;
    }
    task.reporting(reporting);
  },

  LOAD_COMMUNICATIONS_LIST: async (context) => {
    const member = await context.rootGetters['workspace/TASK_ON_WORKSPACE']
      .getMember({ fields: ['communications'] });
    context.commit('SET_COMMUNICATIONS_LIST', member.communications || []);
  },

  SET_NEXT_COMMUNICATION: (context, communication) => {
    context.commit('SET_PROPERTY', { prop: 'nextCommunication', value: communication });
  },

  BEGIN_COMMUNICATION_ADDING: (context) => {
    context.commit('SET_PROPERTY', { prop: 'isNewCommunication', value: true });
  },

  BEGIN_COMMUNICATION_EDIT: (context, communication) => {
    context.commit('SET_PROPERTY', { prop: 'editedCommunication', value: communication });
  },

  ADD_COMMUNICATION: (context, communication) => {
    context.commit('ADD_COMMUNICATION', communication);
    context.dispatch('CLOSE_COMMUNICATION_ACTIONS');
  },

  EDIT_COMMUNICATION: (context, communication) => {
    context.commit('EDIT_COMMUNICATION', communication);
    if (context.state.nextCommunication === context.state.editedCommunication) {
      context.dispatch('SET_NEXT_COMMUNICATION', communication);
    }
    context.dispatch('CLOSE_COMMUNICATION_ACTIONS');
  },

  DELETE_COMMUNICATION: (context, communication) => {
    context.commit('DELETE_COMMUNICATION', communication);
  },

  CLOSE_COMMUNICATION_ACTIONS: (context) => {
    if (context.state.isNewCommunication) {
      context.commit('SET_PROPERTY', { prop: 'isNewCommunication', value: false });
    } else {
      context.commit('SET_PROPERTY', { prop: 'editedCommunication', value: null });
    }
  },

  SET_PROPERTY: (context, payload) => {
    context.commit('SET_PROPERTY', payload);
  },

  RESET_STATE: (context) => {
    context.commit('RESET_STATE');
  },
};

const mutations = {
  SET_COMMUNICATIONS_LIST: (state, communicationsList) => {
    state.communicationsList = communicationsList;
  },

  ADD_COMMUNICATION: (state, communication) => {
    state.communicationsList.push(communication);
  },

  EDIT_COMMUNICATION: (state, communication) => {
    const editedCommunicationIndex = state.communicationsList.indexOf(state.editedCommunication);
    state.communicationsList.splice(editedCommunicationIndex, 1, communication);
  },

  DELETE_COMMUNICATION: (state, communication) => {
    const deletedCommunicationIndex = state.communicationsList.indexOf(communication);
    state.communicationsList.splice(deletedCommunicationIndex, 1);
  },

  SET_PROPERTY: (state, { prop, value }) => {
    state[prop] = value;
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
