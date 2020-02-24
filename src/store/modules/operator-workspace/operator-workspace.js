import { CallActions } from 'webitel-sdk';
import CallConnector from '../../../api/operator-workspace/call-ws-connection';

const state = {
  client: null,
  callList: [],
  openedItem: {
    type: 'call',
  },
};

const getters = {};

const actions = {
  ANSWER: async (context, index) => {
    await context.state.callList[index].answer({});
  },

  TRANSFER: async (context, { user, index }) => {
    console.log(user, index);
    await context.state.callList[index].blindTransfer(user.extension);
  },

  TOGGLE_MUTE: async (context, index) => {
    const isMuted = context.state.callList[index].muted;
    await context.state.callList[index].mute(!isMuted);
  },

  TOGGLE_HOLD: async (context, index) => {
    await context.state.callList[index].toggleHold();
  },

  HANGUP: async (context, index) => {
    await context.state.callList[index].hangup();
    context.commit('RESET_OPENED_ITEM');
  },

  OPEN_CALL: async (context, index) => {
    context.commit('SET_CURRENT_WORKSPACE', {
      index,
      type: 'call',
    });
  },

  INIT_CONNECTION: async (context) => {
    const audio = new Audio();
    const callHandler = (action, call) => {
      switch (action) {
        case CallActions.Ringing:
          context.commit('ADD_CALL', call);
          break;
        case CallActions.Hangup:
          context.commit('REMOVE_CALL', call);
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
  // eslint-disable-next-line no-shadow
  SET_CURRENT_WORKSPACE: (state, { index, type }) => {
    state.openedItem = {
      item: state.callList[index],
      index,
      type,
    };
  },

  // eslint-disable-next-line no-shadow
  ADD_CALL: (state, call) => {
    state.callList.push(call);
  },

  // eslint-disable-next-line no-shadow
  REMOVE_CALL: (state, removedCall) => {
    state.callList = state.callList.filter((call) => call !== removedCall);
  },

  // eslint-disable-next-line no-shadow
  RESET_OPENED_ITEM: (state) => {
    state.openedItem = {};
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
