import { getCliInstance } from '../../../api/agent-workspace/call-ws-connection';

const callParams = { disableStun: true };
const answerParams = { useAudio: true, disableStun: true };

const actions = {
  // destucturing arg due not receive mouse events
  CALL: async (context, { user }) => {
    let destination = user
      ? user.extension
      : context.state.callOnWorkspace.newNumber;
    // eslint-disable-next-line no-useless-escape
    destination = destination.replace(/[^0-9a-zA-z\+\*#]/g, '');
    const client = await getCliInstance();
    const params = { ...callParams, video: context.state.isVideo };
    try {
      await client.call({ destination, params });
    } catch {
    }
  },

  ANSWER: async (context, { index }) => {
    const call = Number.isInteger(index)
      ? context.state.callList[index]
      : context.state.callOnWorkspace;
    if (call.allowAnswer) {
      const params = { ...answerParams, video: context.state.isVideo };
      try {
        await call.answer(params);
        context.dispatch('SET_WORKSPACE', call);
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

  TOGGLE_MUTE: async (context) => {
    const call = context.state.callOnWorkspace;
    const isMuted = call.muted;
    await call.mute(!isMuted);
  },

  TOGGLE_HOLD: async (context) => {
    const call = context.state.callOnWorkspace;
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

  HANGUP: async (context, { index }) => {
    const call = Number.isInteger(index)
      ? context.state.callList[index]
      : context.state.callOnWorkspace;
    if (call.allowHangup) {
      try {
        await call.hangup();
      } catch {
      }
    }
  },
};

export default {
  actions,
};
