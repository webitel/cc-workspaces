import { CallActions, CallDirection } from 'webitel-sdk';
import CallConnector from '../../../api/operator-workspace/call-ws-connection';

const callStates = {
  preview: 'PREVIEW',
  active: 'ACTIVE',
  new: 'NEW',
};

const answerParams = { useAudio: true };

const state = {
  client: null,
  callList: [],
  callState: '', // PREVIEW, ACTIVE, NEW
  workspaceItem: {},
  newCallNumber: '8888',
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
      context.commit('SET_CALL_STATE', callStates.active);
      context.commit('SET_WORKSPACE', call);
    } catch (err) {
      throw err;
    }
  },

  TRANSFER: async (context, { user, index }) => {
    const call = context.state.callList[index];
    try {
      await call.blindTransfer(user.extension);
      context.commit('SET_CALL_STATE', null);
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
      // FIXME: HANDLE ACTIVE CALL OPEN BY CALL STATE
      context.commit('SET_CALL_STATE', callStates.preview);
      context.commit('SET_WORKSPACE', call);
    } else { // else we are trying to create a new call
      context.commit('SET_CALL_STATE', callStates.new);
    }
  },

  CALL_TO_NEW_NUMBER: async (context) => {
    const toNumber = context.state.newCallNumber;
    try {
      await context.state.client.invite({ toNumber });
    } catch (err) {
      throw err;
    }
  },

  ADD_DIGIT: async (context, value) => {
    if (context.state.callState === 'NEW') {
      const newCallNumber = context.state.newCallNumber + value;
      context.dispatch('SET_NEW_CALL_NUMBER', newCallNumber);
    } else {
      context.dispatch('SEND_DTMF', value);
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
    const audio = new Audio();
    const callHandler = (action, call) => {
      switch (action) {
        case CallActions.Ringing:
          context.commit('ADD_CALL', call);
          if (call.direction === CallDirection.Outbound) {
            context.commit('SET_CALL_STATE', callStates.active);
            context.commit('SET_WORKSPACE', call);
          }
          break;
        case CallActions.Hangup:
          context.commit('REMOVE_CALL', call);
          context.commit('RESET_WORKSPACE');
          break;
        case CallActions.PeerStream:
          audio.srcObject = call.peerStreams.pop();
          audio.play();
          break;
        default:
          console.log('default', action);
      }
    };
    const client = await CallConnector(callHandler);
    context.commit('SET_CLI', client);
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

  // SET_NEW_CALL_ID: (state, id) => {
  //   state.newCallId = id;
  //   console.warn('new call id set');
  // },

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
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
