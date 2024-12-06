
const state = {
  manualList: [],
};

const actions = {
  INITIALIZE_MANUAL_LIST: async (context) => {
    const cli = await context.rootState.client.getCliInstance();
    const manualList = cli.agent.waitingListChats;
    context.commit('SET_MANUAL_LIST', manualList);
  },
  ACCEPT_TASK: async (context, task) => {
    const cli = await context.rootState.client.getCliInstance();
    return cli.agent.interceptAttempt(task.attemptId);
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
