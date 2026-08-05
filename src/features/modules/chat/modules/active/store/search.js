import { WebSocketConnectionState } from '../../../../../../ui/enums/WebSocketConnectionState.enum.ts';
import { getChatPreviewName } from '../../../scripts/getChatPreviewName.js';

const state = {
	query: '',
};

const getters = {
	IS_SEARCH_ACTIVE: (state) => Boolean(state.query),
	SEARCH_RESULTS: (state, getters, rootState) => {
		if (!state.query) return [];
		if (rootState.client.state !== WebSocketConnectionState.Connected)
			return [];

		rootState.features.chat.active.visibleChatIds;

		const client = rootState.client.getClientSync();
		if (!client) return [];

		const query = state.query.toLowerCase();
		return client
			.allConversations()
			.filter((chat) => getChatPreviewName(chat).toLowerCase().includes(query));
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
