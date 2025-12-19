const state = {
};

const getters = {
  VIDEO_CALL_CHAT: ((state, getters, rootState, rootGetters) =>
    state['IS_VIDEO_CALL_HAVE_CHAT']
    && rootGetters['workspace/IS_CALL_WORKSPACE']?.conversation
  ),
  MESSAGES: ((state, getters, rootState, rootGetters) =>
    state['IS_VIDEO_CALL_HAVE_CHAT']
    && rootGetters['workspace/IS_CALL_WORKSPACE']?.conversation || []
  ),
  IS_VIDEO_CALL_HAVE_CHAT: ((state, getters, rootState, rootGetters) =>
    rootGetters['workspace/IS_CALL_WORKSPACE']?.client?.connectionInfo?.use_chat
  ),
};

const actions = {
  ACCEPT: async (context) => {
    try {
      await context.getters.CHAT_ON_WORKSPACE.join();
    } catch (err) {
      throw err;
    }
  },

  SEND: async (context, message) => { // перенести в компонент?
    try {
      await context.getters.CHAT_ON_WORKSPACE.send(message);
    } catch (err) {
      throw err;
    }
  },
  SEND_FILE: async (context, files) => { // перенести в компонент?
    try {
      Array.isArray(files)
        ? await Promise.all(files.map((file) => context.dispatch('SEND', file)))
        : await context.dispatch('SEND', files);
    } catch (err) {
      const errorMessage = err.response?.data?.id === 'file.malware'
        ? t('workspaceSec.chat.chatsFileBlocked')
        : t('workspaceSec.chat.errors.uploadFileLimitSize')
      throw applyTransform(err, [
        notify(({ callback }) =>
          callback({
            type: 'error',
            text: errorMessage,
          })
        )
      ]);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
};
