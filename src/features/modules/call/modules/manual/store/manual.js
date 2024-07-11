const state = {
  manualList: [
  //   {
  //     attemptId: '1',
  //     channel: 'call',
  //     communication: { destination: '7744' },
  //     deadline: 76,
  //     position: 1,
  //     queue: { id: 730, name: 'dania-inbound-queue' },
  //     wait: 30,
  //   },
  ],
};

const actions = {
  INITIALIZE_MANUAL_LIST: async (context) => {
    const cli = await context.rootState.client.getCliInstance();
    const manualList = cli.agent.waitingListCalls;
    console.log('STORE manualList:', manualList);
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
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
