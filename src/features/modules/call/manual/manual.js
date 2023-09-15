
const state = {
  manualList: [],
};

const actions = {
  INITIALIZE_MANUAL_LIST: async (context) => {
    const cli = await context.rootState.client.getCliInstance();
    const manualList = cli.agent.waitingListCalls;
    context.commit('SET_MANUAL_LIST', manualList);
  },
  ACCEPT_TASK: async (context, task) => {
    return await context.rootState.client.getCliInstance().agent.interceptAttempt(task.attemptId);
  },
};

const mutations = {
  SET_MANUAL_LIST: (state, manualList) => {
    state.manualList = manualList;
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
}
