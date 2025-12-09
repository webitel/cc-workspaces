import { VideoMediaFlow } from 'webitel-sdk';

const state = {
  screenshotStatus: null,
  screenshotIsLoading: false,
  screenshotPreviewUrl: null,
  screenshotFile: null
};

const actions = {
  //functions for on/off video in video call
  TOGGLE_VIDEO: ({ rootGetters }, { callId }) => {
    const call = callId
      ? rootGetters['features/call/GET_CALL_BY_ID'](callId)
      : rootGetters['features/call/CALL_ON_WORKSPACE'];
    call.muteVideo(!call.mutedVideo)
  },

  MAKE_SCREENSHOT: async ({commit,  rootGetters }, { callId }) => {
    try {
      const call = callId
        ? rootGetters['features/call/GET_CALL_BY_ID'](callId)
        : rootGetters['features/call/CALL_ON_WORKSPACE'];

      const { blob, file } = await call.screenshot();
      const url = URL.createObjectURL(blob);
      commit('SET_SCREENSHOT', { url, file });
    } catch (e) {
      commit('SET_SCREENSHOT_STATUS', 'error');
      console.error('MAKE_SCREENSHOT error', e);
    } finally {
      commit('SET_SCREENSHOT_LOADING', false);
    }

  },
  TOGGLE_RECORDINGS: ({ rootGetters }, { callId }) => {
    const call = callId
      ? rootGetters['features/call/GET_CALL_BY_ID'](callId)
      : rootGetters['features/call/CALL_ON_WORKSPACE'];
    call.startRecord()
  },


  CLOSE_SCREENSHOT({ commit }) {
    commit('CLEAR_SCREENSHOT');
  },
}

const getters = {
  IS_VIDEO_CALL: (state, getters, rootState, rootGetters) => {
    const taskOnWorkspace = rootGetters['workspace/TASK_ON_WORKSPACE'];

    if (!rootGetters['features/call/CALL_ON_WORKSPACE']) {
      return false;
    }

    const video = taskOnWorkspace?.video;

    return (
      video === VideoMediaFlow.SendOnly ||
      video === VideoMediaFlow.SendRecv ||
      video === VideoMediaFlow.RecvOnly
    );
  },
  SCREENSHOT_PREVIEW_URL: (state) => state.screenshotPreviewUrl,
  SCREENSHOT_STATUS: (state) => state.screenshotStatus,
  SCREENSHOT_IS_LOADING: (state) => state.screenshotIsLoading,
}

const mutations = {
  SET_SCREENSHOT_LOADING(state, value) {
    state.screenshotIsLoading = value;
  },
  SET_SCREENSHOT(state, payload) {
    state.screenshotPreviewUrl = payload.url;
    state.screenshotFile = payload.file;
    state.screenshotStatus = 'done';
  },
  SET_SCREENSHOT_STATUS(state, status) {
    state.screenshotStatus = status;
  },
  CLEAR_SCREENSHOT(state) {
    if (state.screenshotPreviewUrl) {
      URL.revokeObjectURL(state.screenshotPreviewUrl);
    }
    state.screenshotPreviewUrl = null;
    state.screenshotFile = null;
    state.screenshotStatus = 'idle';
  },
};


export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
