import getCliInstance from '../../../api/agent-workspace/call-ws-connection';
import CallStates from '../../callUtils/CallStates';

const answerParams = { useAudio: true };

const actions = {
  CALL: async (context) => {
    const destination = context.state.newCallNumber;
    const client = await getCliInstance();
    try {
      await client.call({ destination });
    } catch {
    }
  },

  ANSWER: async (context, index) => {
    const call = Number.isInteger(index)
      ? context.state.callList[index] : context.state.callOnWorkspace;
    if (call.allowAnswer) {
      try {
        await call.answer(answerParams);
        context.commit('SET_CALL_STATE', CallStates.ACTIVE);
        context.commit('SET_WORKSPACE', call);
      } catch {
      }
    }
  },

  TRANSFER: async (context, user) => {
    const call = context.state.callOnWorkspace;
    try {
      await call.blindTransfer(user.extension);
      // context.commit('REMOVE_CALL', call);
      // context.commit('RESET_WORKSPACE');
    } catch {
    }
  },

  BRIDGE: async (context, callToBridge) => {
    const call = context.state.callOnWorkspace;
    try {
      await call.bridgeTo(callToBridge);
      // context.commit('REMOVE_CALL', call);
      // context.commit('RESET_WORKSPACE');
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

  SEND_DTMF: async (context, value) => {
    const call = context.state.callOnWorkspace;
    if (call.allowDtmf) {
      try {
        await call.sendDTMF(value);
      } catch {
      }
    }
  },

  HANGUP: async (context, index) => {
    const call = Number.isInteger(index)
      ? context.state.callList[index] : context.state.callOnWorkspace;
    if (call.allowHangup) {
      try {
        await call.hangup();
        context.commit('RESET_WORKSPACE');
      } catch {
      }
    }
  },
};

export default {
  actions,
};
