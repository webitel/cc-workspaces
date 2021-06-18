import { getCliInstance } from '../../../api/agent-workspace/call-ws-connection';

const state = {
  isDisconnectPopup: false,
};

const getters = {};

const actions = {
  INIT_GLOBAL_HANDLERS: (context) => {
    context.dispatch('SUBSCRIBE_TO_CLIENT_DISCONNECT');
  },
  RESET_GLOBAL_HANDLERS: (context) => {
    context.dispatch('CLOSE_DISCONNECT_POPUP');
  },
  SUBSCRIBE_TO_CLIENT_DISCONNECT: async (context) => {
    const client = await getCliInstance();
    client.on('disconnected', () => context.dispatch('OPEN_DISCONNECT_POPUP'));
  },
  OPEN_DISCONNECT_POPUP: (context) => context.commit('SET_DISCONNECT_POPUP', true),
  CLOSE_DISCONNECT_POPUP: (context) => context.commit('SET_DISCONNECT_POPUP', false),
};

const mutations = {
  SET_DISCONNECT_POPUP: (state, value) => {
    state.isDisconnectPopup = value;
},
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
