import { getAllClientConversations } from '../../../scripts/getClientConversations';
import { getClientName } from '../../../scripts/getClientName.js';

const state = {
	query: '',
};

const getters = {
	IS_SEARCH_ACTIVE: (state) => Boolean(state.query.trim()),
	IS_SEARCH_LOADING: (state, getters, rootState) =>
		getters.IS_SEARCH_ACTIVE && rootState.features.chat.active.isLoading,
	SEARCH_RESULTS: (state, getters, rootState) => {
		if (!state.query) return [];

		const query = state.query.trim().toLowerCase();

		return getAllClientConversations(rootState).filter((chat) => {
			return getClientName(chat.members).toLowerCase().includes(query);
		});
	},
};

const actions = {
	SET_QUERY: (context, query) => {
		context.commit('SET_QUERY', query || '');
	},
	RESET_SEARCH: (context) => {
		context.commit('SET_QUERY', '');
	},
};

const mutations = {
	SET_QUERY: (state, query) => {
		state.query = query;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
