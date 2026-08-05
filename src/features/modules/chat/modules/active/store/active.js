import { WebSocketConnectionState } from '../../../../../../ui/enums/WebSocketConnectionState.enum.ts';
import ActiveChatsAPI from '../api/activeChats';
import { buildConversationFromDialog } from '../scripts/buildConversationFromDialog';

const state = {
	visibleChatIds: [],
	page: 1,
	size: 10,
	next: false,
	isLoading: false,
};

const getters = {
	VISIBLE_CHAT_LIST: (state, getters, rootState, rootGetters) => {
		// reactive dep: `state` changes exactly when the instance appears/disappears
		if (rootState.client.state !== WebSocketConnectionState.Connected)
			return [];

		const client = rootState.client.getClientSync();
		if (!client) return [];

		return state.visibleChatIds
			.map((id) =>
				client.allConversations().find((chat) => chat.conversationId === id),
			)
			.filter(Boolean);
	},
};

const actions = {
	// @author ye-pohranichna
	// get all chats from REST API and set to WS to provide all WS actions to all active chats
	// by default WS server-part return only 40 chats after page reload
	RELOAD_CHAT_LIST: async (context) => {
		context.commit('SET_IS_LOADING', true);
		context.commit('SET_VISIBLE_CHAT_IDS', []);
		context.commit('SET_PAGE', 1);
		const reloadPageSize = 40;
		let hasNext;
		let localPage = 1;

		try {
			while (hasNext || localPage === 1) {
				const { items: dialogs, next } = await ActiveChatsAPI.getList({
					page: localPage,
					size: reloadPageSize,
				});

				await context.dispatch('ADD_CHAT_LIST_TO_CLIENT_STORE', dialogs);

				// first batch already holds the visible page — no extra request for it
				if (localPage === 1) {
					const ids = dialogs
						.slice(0, context.state.size)
						.map((dialog) => dialog.id);

					context.commit('SET_VISIBLE_CHAT_IDS', ids);
					context.commit(
						'SET_NEXT',
						dialogs.length > context.state.size || next,
					);
				}

				hasNext = next;
				localPage += 1;
			}
		} finally {
			context.commit('SET_IS_LOADING', false);
		}
	},

	ADD_CHAT_LIST_TO_CLIENT_STORE: async (context, chats) => {
		const client = context.rootState.client.getClientSync();
		if (!client) return;

		const existingIds = client
			.allConversations()
			.map((chat) => chat.conversationId);

		chats.forEach((dialog) => {
			if (existingIds.includes(dialog.id)) return;

			const conversation = buildConversationFromDialog({
				client,
				dialog,
			});

			if (!conversation) return;

			client.conversationStore.set(conversation.id, conversation);
		});
	},
	LOAD_NEXT_ACTIVE_CHATS: async (context) => {
		if (!context.state.next || context.state.isLoading) return;

		const nextPage = context.state.page + 1;
		context.commit('SET_IS_LOADING', true);

		try {
			const { items: dialogs, next } = await ActiveChatsAPI.getList({
				page: nextPage,
				size: context.state.size,
			});

			const ids = dialogs.map((dialog) => dialog.id);

			context.commit('SET_VISIBLE_CHAT_IDS', [
				...context.state.visibleChatIds,
				...ids,
			]);
			context.commit('SET_PAGE', nextPage);
			context.commit('SET_NEXT', next);
		} finally {
			context.commit('SET_IS_LOADING', false);
		}
	},

	CHAT_INSERT_TO_START: (context, chat) => {
		const chatId = chat.conversationId;
		const idList = context.state.visibleChatIds.filter((id) => id !== chatId);
		context.commit('SET_VISIBLE_CHAT_IDS', [
			chatId,
			...idList,
		]);
	},
	REMOVE_CHAT: (context, chat) => {
		const chatId = chat.conversationId;
		const idList = context.state.visibleChatIds.filter((id) => id !== chatId);
		context.commit('SET_VISIBLE_CHAT_IDS', [
			...idList,
		]);
	},
};

const mutations = {
	SET_VISIBLE_CHAT_IDS: (state, ids) => {
		state.visibleChatIds = [
			...new Set(ids),
		];
	},
	SET_PAGE: (state, page) => {
		state.page = page;
	},
	SET_NEXT: (state, next) => {
		state.next = next;
	},
	SET_IS_LOADING: (state, value) => {
		state.isLoading = value;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
