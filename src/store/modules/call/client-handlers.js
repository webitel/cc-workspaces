import { CallActions, CallDirection } from 'webitel-sdk';

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
    const client = await context.rootState.client.getCliInstance();
    await client.subscribeCall(callHandler(context), null);
    const callList = client.allCall();
    if (callList.length) context.dispatch('SET_CALL_LIST', callList);
  },

  HANDLE_RINGING_ACTION: (context, call) => {
    context.dispatch('ADD_CALL', call);
    if (call.direction === CallDirection.Outbound
      || context.rootGetters['workspace/IS_EMPTY_WORKSPACE']) {
      context.dispatch('SET_WORKSPACE', call);
    }
  },

  HANDLE_HANGUP_ACTION: (context, call) => {
    if (!call.allowReporting || call.reportingAt) {
      context.commit('REMOVE_CALL', call);
      context.dispatch('RESET_WORKSPACE');
    }
    context.dispatch('HANDLE_CALL_END');
  },

  HANDLE_DESTROY_ACTION: (context, call) => {
    context.commit('REMOVE_CALL', call);
    if (call.direction === CallDirection.Inbound && !call.answeredAt) {
      context.dispatch('missed/PUSH_MISSED_STUB', call);
    }
    context.dispatch('HANDLE_CALL_END');
    context.dispatch('RESET_WORKSPACE');
  },

  HANDLE_STREAM_ACTION: (context, call) => {
    const audio = new Audio();
    const stream = call.peerStreams.slice(-1).pop();
    if (stream) {
      audio.srcObject = stream;
      audio.play();
      context.dispatch('HANDLE_START_TALKING');
    }
  },

  HANDLE_START_TALKING: (context) => {
    context.dispatch('notifications/HANDLE_CALL_START', null, { root: true });
  },

  HANDLE_CALL_END: (context) => {
    context.dispatch('notifications/HANDLE_CALL_END', null, { root: true });
  },
};

export default {
  actions,
};
