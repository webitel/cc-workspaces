import { CallActions, CallDirection } from 'webitel-sdk';
import CallConnector from '../../../api/operator-workspace/call-ws-connection';

export const CallStates = Object.freeze({
  PREVIEW: Symbol('preview'),
  ACTIVE: Symbol('active'),
  NEW: Symbol('new'),
});

const answerParams = { useAudio: true };
let interval = null;

const state = {
  client: null,
  callList: [],
  callState: '', // PREVIEW, ACTIVE, NEW
  workspaceItem: {},
  newCallNumber: '8888',
  now: Date.now(),
};

const getters = {
  GET_CURRENT_ITEM_NAME: (state) => state.workspaceItem.displayName,

  GET_CURRENT_ITEM_NUMBER: (state) => state.workspaceItem.displayNumber,

  GET_CURRENT_CALL_DIGITS: (state) => state.workspaceItem.digits,
};

const actions = {
  ANSWER: async (context, index) => {
    const call = Number.isInteger(index)
      ? context.state.callList[index] : context.state.workspaceItem;
    try {
      await call.answer(answerParams);
      context.commit('SET_CALL_STATE', CallStates.ACTIVE);
      context.commit('SET_WORKSPACE', call);
    } catch (err) {
      throw err;
    }
  },

  TRANSFER: async (context, user) => {
    const call = context.state.workspaceItem;
    try {
      await call.blindTransfer(user.extension);
      context.commit('SET_CALL_STATE', null);
      context.commit('REMOVE_CALL', call);
      context.commit('RESET_WORKSPACE');
    } catch (err) {
      throw err;
    }
  },

  TOGGLE_MUTE: async (context) => {
    const call = context.state.workspaceItem;
    const isMuted = call.muted;
    await call.mute(!isMuted);
  },

  TOGGLE_HOLD: async (context) => {
    const call = context.state.workspaceItem;
    try {
      await call.toggleHold();
    } catch (err) {
      throw err;
    }
  },

  HANGUP: async (context, index) => {
    const call = Number.isInteger(index)
      ? context.state.callList[index] : context.state.workspaceItem;
      // console.log(index, call);
    try {
      await call.hangup();
      context.commit('RESET_WORKSPACE');
    } catch (err) {
      throw err;
    }
  },

  OPEN_CALL: async (context, index) => {
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

  CALL_TO_NEW_NUMBER: async (context) => {
    const destination = context.state.newCallNumber;
    try {
      await context.state.client.call({ destination });
    } catch (err) {
      throw err;
    }
  },

  ADD_DIGIT: async (context, value) => {
    if (context.state.callState !== CallStates.NEW) {
      context.dispatch('SEND_DTMF', value);
    } else {
      const newCallNumber = context.state.newCallNumber + value;
      context.dispatch('SET_NEW_CALL_NUMBER', newCallNumber);
    }
  },

  SEND_DTMF: async (context, value) => {
    const call = context.state.workspaceItem;
    try {
      await call.sendDTMF(value);
    } catch (err) {
      throw err;
    }
  },

  SET_NEW_CALL_NUMBER: (context, value) => {
    context.commit('SET_NEW_CALL_NUMBER', value);
  },

  INIT_CONNECTION: async (context) => {
    const callHandler = (action, call) => {
      switch (action) {
        case CallActions.Ringing:
          context.dispatch('HANDLE_RINGING_ACTION', call);
          break;
        case CallActions.Hangup:
          context.dispatch('HANDLE_HANGUP_ACTION', call);
          break;
        case CallActions.PeerStream:
          context.dispatch('HANDLE_STREAM_ACTION', call);
          break;
        default:
          console.log('default', action);
      }
    };
    const client = await CallConnector(callHandler);
    context.commit('SET_CLI', client);
  },

  HANDLE_RINGING_ACTION: (context, call) => {
    context.commit('ADD_CALL', call);
    if (call.direction === CallDirection.Outbound) {
      context.commit('SET_CALL_STATE', CallStates.ACTIVE);
      context.commit('SET_WORKSPACE', call);
    }
  },

  HANDLE_HANGUP_ACTION: (context, call) => {
    context.commit('REMOVE_CALL', call);
    context.commit('RESET_WORKSPACE');
  },

  HANDLE_STREAM_ACTION: (context, call) => {
    const audio = new Audio();
    audio.srcObject = call.peerStreams.pop();
    audio.play();
  },

  SET_NOW_WATCHER: (context) => {
    interval = setInterval(() => {
      context.commit('UPDATE_NOW');
    }, 1000);
  },

  CLEAR_NOW_WATCHER: () => {
    clearInterval(interval);
  },
};

const mutations = {
  SET_CLI: (state, client) => {
    state.client = client;
  },

  SET_WORKSPACE: (state, call) => {
    state.workspaceItem = call;
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
    state.workspaceItem = {};
  },

  UPDATE_NOW: (state) => {
    state.now = Date.now();
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
