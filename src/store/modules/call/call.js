import clientHandlers from './client-handlers';
import clientActions from './client-actions';
import CallStates from './callUtils/CallStates';
import WorkspaceStates from '../agent-workspace/workspaceUtils/WorkspaceStates';

const state = {
  callList: [],
  callState: '', // PREVIEW, ACTIVE, NEW
  callOnWorkspace: {},
  newCallNumber: '',
};

const getters = {
  GET_CURRENT_CALL_DIGITS: (state) => {
    if (state.callOnWorkspace.digits && state.callOnWorkspace.digits.lengh) {
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
    context.commit('SET_CALL_STATE', CallStates.ACTIVE);
    context.dispatch('SET_WORKSPACE', call);
  },

  OPEN_NEW_CALL: (context) => {
    context.dispatch('SET_WORKSPACE', {});
    context.commit('SET_CALL_STATE', CallStates.NEW);
  },

  OPEN_PREVIEW_TRANSFER: (context) => {
    context.commit('SET_CALL_STATE', CallStates.TRANSFER);
  },

  ADD_DIGIT: async (context, value) => {
    const call = context.state.callOnWorkspace;
    // if there's a call, send dtmf
    if (call.allowDtmf) {
      context.dispatch('SEND_DTMF', value);
      // else user types a number
    } else {
      const newCallNumber = context.state.newCallNumber + value;
      context.dispatch('SET_NEW_CALL_NUMBER', newCallNumber);
    }
  },

  SET_NEW_CALL_NUMBER: (context, value) => {
    context.commit('SET_NEW_CALL_NUMBER', value);
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
    if (call) context.commit('SET_WORKSPACE', call); // else it's new call
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

  SET_CALL_STATE: (state, callState) => {
    state.callState = callState;
  },

  SET_NEW_CALL_NUMBER: (state, value) => {
    state.newCallNumber = value;
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
