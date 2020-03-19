import { CallActions } from 'webitel-sdk';
import clientHandlers from './client-handlers';
import clientActions from './client-actions';
import CallStates from '../../callUtils/CallStates';

const state = {
  callList: [],
  callState: '', // PREVIEW, ACTIVE, NEW
  callOnWorkspace: {},
  newCallNumber: '8888',
};

const getters = {
  GET_CURRENT_ITEM_NAME: (state) => state.callOnWorkspace.displayName,

  GET_CURRENT_ITEM_NUMBER: (state) => state.callOnWorkspace.displayNumber,

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

  OPEN_CALL_ON_WORKSPACE: async (context, index) => {
    if (Number.isInteger(index)) { // if there's index, we have gotten
      const call = context.state.callList[index]; // this item from queue => call already exists
      if (call.state === CallActions.Ringing) {
        context.commit('SET_CALL_STATE', CallStates.PREVIEW);
      } else {
        context.commit('SET_CALL_STATE', CallStates.ACTIVE);
      }
      context.commit('SET_WORKSPACE', call);
    } else { // else we are trying to create a new call
      context.commit('SET_CALL_STATE', CallStates.NEW);
    }
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

  RESET_WORKSPACE: (state) => {
    state.callState = null;
    state.callOnWorkspace = {};
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
