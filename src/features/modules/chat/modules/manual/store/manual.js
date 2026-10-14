const MANUAL_CHATS_PAGE_SIZE = 10;

const state = {
	manualList: [],
	agent: null,
};

const getters = {
	TOTAL_COUNT: (state) =>
		state.agent?.waitingChatsSize ?? state.manualList.length,
	HAS_MORE: (state, getters) => getters.TOTAL_COUNT > state.manualList.length,
};

const actions = {
	INITIALIZE_MANUAL_LIST: async (context) => {
		const cli = await context.rootState.client.getCliInstance();
		const manualList = cli.agent.waitingListChats;
		context.commit('SET_AGENT', cli.agent);
		context.commit('SET_MANUAL_LIST', manualList);
	},
	LOAD_MORE: async (context) => {
		const cli = await context.rootState.client.getCliInstance();
		cli.agent.limitWaitingListChats(
			cli.agent.maxWaitingListChats + MANUAL_CHATS_PAGE_SIZE,
		);
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
	SET_AGENT: (state, agent) => {
		state.agent = agent;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
