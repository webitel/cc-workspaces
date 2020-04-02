import { CallActions, CallDirection } from 'webitel-sdk';
import CallStates from './callUtils/CallStates';
import getCliInstance from '../../../api/agent-workspace/call-ws-connection';

const callHandler = (context) => (action, call) => {
  switch (action) {
    case CallActions.Ringing:
      context.dispatch('HANDLE_RINGING_ACTION', call);
      break;
    case CallActions.Active:
      context.dispatch('HOLD_OTHER_CALLS', call);
      break;
    case CallActions.Hangup:
      context.dispatch('HANDLE_HANGUP_ACTION', call);
      break;
    case CallActions.PeerStream:
      context.dispatch('HANDLE_STREAM_ACTION', call);
      break;
    default:
      // console.log('default', action);
  }
};

const actions = {
  SUBSCRIBE_CALLS: async (context) => {
    const client = await getCliInstance();
    await client.subscribeCall(callHandler(context), null);
  },

  HANDLE_RINGING_ACTION: (context, call) => {
    const isPreviewDialer = call.queue && call.queue.queue_type === 'preview';
    context.commit('ADD_CALL', call);
    if (call.direction === CallDirection.Inbound || isPreviewDialer) {
      context.commit('SET_CALL_STATE', CallStates.PREVIEW);
    } else {
      context.commit('SET_CALL_STATE', CallStates.ACTIVE);
    }
    context.dispatch('SET_WORKSPACE', call);
  },

  HANDLE_HANGUP_ACTION: (context, call) => {
    context.commit('REMOVE_CALL', call);
    context.dispatch('RESET_WORKSPACE');
  },

  HANDLE_STREAM_ACTION: (context, call) => {
    const audio = new Audio();
    audio.srcObject = call.peerStreams.pop();
    audio.play();
  },
};

export default {
  actions,
};
