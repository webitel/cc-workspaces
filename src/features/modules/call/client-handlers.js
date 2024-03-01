import { CallActions, CallDirection } from 'webitel-sdk';
import openLinkFromVariable from '../../../app/scripts/openLinkFromVariable';

const callHandler = (context) => (action, call) => {
  switch (action) {
    case CallActions.Ringing:
      context.dispatch('HANDLE_RINGING_ACTION', call);
      break;
    case CallActions.Active:
      context.dispatch('HANDLE_ACTIVE_ACTION', call);
      break;
    case CallActions.Hangup:
      // context.dispatch('HANDLE_HANGUP_ACTION', call);
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

  HANDLE_RINGING_ACTION: async (context, call) => {
    await context.dispatch('ADD_CALL', call);

    if (call.direction === CallDirection.Outbound
      || context.rootGetters['workspace/IS_EMPTY_WORKSPACE']) {
      await context.dispatch('SET_WORKSPACE', call);
    }

    if (call.direction === CallDirection.Inbound) {
      const callId = call.id;
      await context.dispatch('features/notifications/HANDLE_INBOUND_CALL_RINGING', {
        answer: () => context.dispatch('ANSWER', { callId }),
        hangup: () => context.dispatch('HANGUP', { callId }),
      }, { root: true });
    }
  },

  HANDLE_ACTIVE_ACTION: async (context, call) => {
    if (call.firstActive) openLinkFromVariable(call);
    context.dispatch('HOLD_OTHER_CALLS', call);
  },

  HANDLE_DESTROY_ACTION: async (context, call) => {
    // order is important: awaiting handle_call_end fixes https://my.webitel.com/browse/DEV-2401
    await context.dispatch('HANDLE_CALL_END');

    context.commit('REMOVE_CALL', call);

    if (context.getters['missed/IS_CALL_MISSED'](call)) {
      await context.dispatch('missed/ON_CALL_MISS', call);
    }

    await context.dispatch('RESET_WORKSPACE');
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

  HANDLE_START_TALKING: (context) => context.dispatch('features/notifications/HANDLE_CALL_START', null, { root: true }),

  HANDLE_CALL_END: (context) => context.dispatch('features/notifications/HANDLE_CALL_END', null, { root: true }),
};

export default {
  actions,
};
