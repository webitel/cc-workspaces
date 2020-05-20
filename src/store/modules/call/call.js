import clientHandlers from './client-handlers';
import clientActions from './client-actions';
import WorkspaceStates from '../agent-workspace/workspaceUtils/WorkspaceStates';

const state = {
  callList: [],
  callOnWorkspace: {},
};

const getters = {
  GET_CURRENT_CALL_DIGITS: (state) => {
    if (state.callOnWorkspace.digits
      && state.callOnWorkspace.digits.length) {
      return state.callOnWorkspace.digits;
    }
    return '';
  },
};

const actions = {
  ...clientActions.actions,
  ...clientHandlers.actions,

  OPEN_ACTIVE_CALL: (context, index) => {
    const call = context.state.callList[index];
    context.dispatch('SET_WORKSPACE', call);
  },

  OPEN_NEW_CALL: (context) => {
    context.dispatch('SET_WORKSPACE', { _isNew: true, newNumber: '' });
  },

  ADD_DIGIT: async (context, value) => {
    const call = context.state.callOnWorkspace;
    if (call.allowDtmf) {
      // if there's a call, send dtmf
      context.dispatch('SEND_DTMF', value);
    } else {
      // else user types a number
      const newNumber = call.newNumber + value;
      context.dispatch('SET_NEW_NUMBER', newNumber);
    }
  },

  SET_NEW_NUMBER: (context, value) => {
    context.commit('SET_NEW_NUMBER', value);
  },

  HOLD_OTHER_CALLS: (context, activeCall) => {
    if (context.state.callList.length > 1) {
      context.state.callList.forEach((call) => {
        if (call !== activeCall) context.dispatch('SET_HOLD', call);
      });
    }
  },

  SET_WORKSPACE: (context, call) => {
    context.dispatch('workspace/SET_WORKSPACE_STATE', WorkspaceStates.CALL, { root: true });
    context.commit('SET_WORKSPACE', call);
  },

  RESET_WORKSPACE: (context) => {
    context.dispatch('workspace/RESET_WORKSPACE_STATE', null, { root: true });
    context.commit('SET_WORKSPACE', {});
  },
};

const mutations = {
  ...clientHandlers.mutations,

  SET_WORKSPACE: (state, call) => {
    state.callOnWorkspace = call;
  },

  SET_NEW_NUMBER: (state, value) => {
    state.callOnWorkspace.newNumber = value;
  },

  ADD_CALL: (state, call) => {
    state.callList.push(call);
  },

  REMOVE_CALL: (state, removedCall) => {
    state.callList = state.callList.filter((call) => call !== removedCall);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
