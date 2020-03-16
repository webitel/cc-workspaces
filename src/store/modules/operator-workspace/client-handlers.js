import { CallActions, CallDirection } from 'webitel-sdk';
import CallStates from '../../callUtils/CallStates';
import CallConnector from '../../../api/operator-workspace/call-ws-connection';

const callHandler = (context) => (action, call) => {
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

const actions = {
  INIT_CLIENT: async (context) => {
    const client = await CallConnector(callHandler(context));
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
};

const mutations = {
  SET_CLI: (state, client) => {
    state.client = client;
  },
};

export default {
  actions,
  mutations,
};
