const state = {
};

const getters = {
  TASK_POST_PROCESSING: (s, g, rS, rootGetters) => rootGetters['workspace/TASK_ON_WORKSPACE'].postProcessData,
  IS_MEMBER: (state, getters, rootState, rootGetters) => rootGetters['workspace/TASK_ON_WORKSPACE'].isMember,
  IS_COMMUNICATION_POPUP: (state, getters) => getters.TASK_POST_PROCESSING.isNewCommunication
    || getters.TASK_POST_PROCESSING.editedCommunication,
};

const actions = {
};

const mutations = {
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
