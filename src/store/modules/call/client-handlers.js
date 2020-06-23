import { CallActions, CallDirection } from 'webitel-sdk';
import { getCliInstance } from '../../../api/agent-workspace/call-ws-connection';

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
    case CallActions.Destroy:
      context.dispatch('HANDLE_DESTROY_ACTION', call);
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
    // await client.subscribeTask((...args) => {
    //   console.log('task', args);
    // });
  },

  HANDLE_RINGING_ACTION: (context, call) => {
    context.commit('ADD_CALL', call);
    if (call.direction === CallDirection.Outbound
      || !context.state.callOnWorkspace) {
      context.dispatch('SET_WORKSPACE', call);
    }
  },

  HANDLE_HANGUP_ACTION: (context, call) => {
    if (!call.allowReporting || call.reportingAt) {
      context.commit('REMOVE_CALL', call);
      context.dispatch('RESET_WORKSPACE');
    }
  },

  HANDLE_DESTROY_ACTION: (context, call) => {
    context.commit('REMOVE_CALL', call);
    if (call.direction === CallDirection.Inbound && !call.answeredAt) {
      context.dispatch('missed/PUSH_MISSED_STUB', call);
    }
    context.dispatch('RESET_WORKSPACE');
  },

  HANDLE_STREAM_ACTION: (context, call) => {
    const audio = new Audio();
    const stream = call.peerStreams.slice(-1).pop();
    if (stream) {
      audio.srcObject = stream;
      audio.play();
    }
  },
};

export default {
  actions,
};
