const state = {
};

const getters = {
  VIDEO_CALL_CHAT: ((state, getters, rootState, rootGetters) =>
    rootGetters['features/call/videoCall/IS_VIDEO_CALL']
    && rootGetters['features/call/CALL_ON_WORKSPACE']?.conversation)
};


export default {
  namespaced: true,
  state,
  getters,
};
