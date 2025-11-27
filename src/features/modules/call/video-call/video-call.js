

const actions = {
  //functions for on/off video in video call
  TOGGLE_VIDEO: ({ rootGetters }, { callId }) => {
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
