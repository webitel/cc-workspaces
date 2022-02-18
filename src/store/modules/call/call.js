import WorkspaceStates from '../agent-workspace/workspaceUtils/WorkspaceStates';
import clientHandlers from './client-handlers';
import missed from './missed-calls/missed-calls';

const state = {
  callList: [],
  callOnWorkspace: {},
  isVideo: false,
};
const getters = {
  GET_CALL_BY_ID: (state) => (callId) => state.callList.find((call) => call.id === callId),

  IS_NEW_CALL: (state) => state.callOnWorkspace._isNew,

  GET_CURRENT_CALL_DIGITS: (state) => {
    if (state.callOnWorkspace.digits
      && state.callOnWorkspace.digits.length) {
      return state.callOnWorkspace.digits;
    }
    return '';
  },
};

const actions = {
  ...clientHandlers.actions,

  SET_CALL_LIST: (context, callList) => {
    context.commit('SET_CALL_LIST', callList);
  },

  ADD_CALL: (context, call) => {
    context.commit('ADD_CALL', call);
  },

  // destructuring arg in order to skip mouse events
  CALL: async (context, { user }) => {
    const CALL_PARAMS = { disableStun: true };
    let destination = user
      ? user.extension
      : context.state.callOnWorkspace.newNumber;
    // eslint-disable-next-line no-useless-escape
    destination = destination.replace(/[^0-9a-zA-z\+\*#]/g, '');
    const client = await context.rootState.client.getCliInstance();
    const params = { ...CALL_PARAMS, video: context.state.isVideo };
    try {
      await client.call({ destination, params });
    } catch {
    }
  },

  ANSWER: async (context, { callId } = {}) => {
    const ANSWER_PARAMS = { useAudio: true, disableStun: true };
    const call = callId
      ? context.getters.GET_CALL_BY_ID(callId)
      : context.state.callOnWorkspace;
    if (call.allowAnswer) {
      const params = { ...ANSWER_PARAMS, video: context.state.isVideo };
      try {
        await call.answer(params);
        await context.dispatch('SET_WORKSPACE', call);
      } catch {
      }
    }
  },

  BLIND_TRANSFER: async (context, number) => {
    const call = context.state.callOnWorkspace;
    try {
      await call.blindTransfer(number);
      // context.commit('REMOVE_CALL', call);
      // context.dispatch('RESET_WORKSPACE');
    } catch {
    }
  },

  BRIDGE: async (context, callToBridge) => {
    const call = context.state.callOnWorkspace;
    try {
      await call.bridgeTo(callToBridge);
      // context.commit('REMOVE_CALL', call);
      // context.dispatch('RESET_WORKSPACE');
    } catch {
    }
  },

  TOGGLE_MUTE: async (context, { callId } = {}) => {
    const call = callId ? context.getters.GET_CALL_BY_ID(callId) : context.state.callOnWorkspace;
    const isMuted = call.muted;
    await call.mute(!isMuted);
  },

  TOGGLE_HOLD: async (context, { callId } = {}) => {
    const call = callId ? context.getters.GET_CALL_BY_ID(callId) : context.state.callOnWorkspace;
    if ((!call.isHold && call.allowHold)
      || (call.isHold && call.allowUnHold)) {
      try {
        await call.toggleHold();
      } catch {
      }
    }
  },

  SET_HOLD: async (context, call) => {
    if (!call.isHold && call.allowHold) {
      call.hold();
    }
  },

  SEND_DTMF: async (context, value) => {
    const call = context.state.callOnWorkspace;
    if (call.allowDtmf) {
      try {
        await call.sendDTMF(value);
      } catch {
      }
    }
  },

  HANGUP: async (context, { callId } = {}) => {
    const call = callId
      ? context.getters.GET_CALL_BY_ID(callId)
      : context.state.callOnWorkspace;
    if (call.allowHangup) {
      try {
        await call.hangup();
      } catch {
      }
    }
  },

  OPEN_ACTIVE_CALL: (context, index) => {
    const call = context.state.callList[index];
    context.dispatch('SET_WORKSPACE', call);
  },

  // new number destructuring to prevent mouse event
  OPEN_NEW_CALL: (context, { newNumber }) => {
    context.dispatch('SET_WORKSPACE', { _isNew: true, newNumber: newNumber || '' });
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
    context.dispatch('notifications/STOP_PLAYING', null, { root: true });
    if (context.state.callList.length > 1) {
      context.state.callList.forEach((call) => {
        if (call !== activeCall) context.dispatch('SET_HOLD', call);
      });
    }
  },

  TOGGLE_VIDEO: (context) => {
    const value = !context.state.isVideo;
    localStorage.setItem('isVideo', JSON.stringify(value));
    context.commit('SET_VIDEO', value);
  },

  RESTORE_VIDEO_PARAM: (context) => {
    const value = localStorage.getItem('isVideo');
    if (value) context.commit('SET_VIDEO', JSON.parse(value));
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

  SET_VIDEO: (state, value) => {
    state.isVideo = value;
  },

  SET_CALL_LIST: (state, callList) => {
    state.callList = callList;
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
  modules: { missed },
};
