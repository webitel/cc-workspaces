

const actions = {
  VIDEO_TOGGLE: ({ rootGetters }, { callId }) => {
    const call = callId
      ? rootGetters['features/call/GET_CALL_BY_ID'](callId)
      : rootGetters['features/call/CALL_ON_WORKSPACE'];
    call.muteVideo(!call.mutedVideo)
  },
}


export default {
  namespaced: true,
  actions,
};
