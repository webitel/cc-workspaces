const state = {
  isDisconnectPopup: false,
  isPhoneReg: false,
};

const getters = {};

const actions = {
  INIT_GLOBAL_HANDLERS: (context) => {
    context.dispatch('SUBSCRIBE_TO_CLIENT_DISCONNECT');
    context.dispatch('SUBSCRIBE_TO_PHONE_REGISTRATION');
  },
  RESET_GLOBAL_HANDLERS: (context) => {
    context.dispatch('CLOSE_DISCONNECT_POPUP');
  },
  SUBSCRIBE_TO_CLIENT_DISCONNECT: async (context) => {
    const client = await context.rootState.client.getCliInstance();
    client.on('disconnected', () => context.dispatch('OPEN_DISCONNECT_POPUP'));
  },
  SUBSCRIBE_TO_PHONE_REGISTRATION: async (context) => {
    const client = await context.rootState.client.getCliInstance();
    client.on('phone_registered', (isPhoneReg) => context.commit('SET_PHONE_REG', isPhoneReg));
  },
  OPEN_DISCONNECT_POPUP: (context) => context.commit('SET_DISCONNECT_POPUP', true),
  CLOSE_DISCONNECT_POPUP: (context) => context.commit('SET_DISCONNECT_POPUP', false),
};

const mutations = {
  SET_DISCONNECT_POPUP: (state, value) => {
    state.isDisconnectPopup = value;
  },
  SET_PHONE_REG: (state, isPhoneReg) => {
    state.isPhoneReg = isPhoneReg;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
