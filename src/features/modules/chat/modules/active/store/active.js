import { WebSocketConnectionState } from '../../../../../../ui/enums/WebSocketConnectionState.enum.ts';
import { useUserinfoStore } from '../../../../../../ui/modules/userinfo/userinfoStore';
import ActiveChatsAPI from '../api/activeChats';
import { buildConversationFromDialog } from '../scripts/buildConversationFromDialog';
import search from './search';

const RELOAD_PAGE_SIZE = 40;
const MAX_RELOAD_PAGES = 50;

// Chats the WS client currently holds. Empty until the socket is connected.
const getClientChats = (rootState) => {
	if (rootState.client.state !== WebSocketConnectionState.Connected) return [];

	const client = rootState.client.getClientSync();
	if (!client) return [];

	return client.allConversations().filter((chat) => !chat.closedAt);
};

const state = {
	visibleChatIds: [],
	size: 10,
	isLoading: false,
};

const getters = {
	// full list for counters and More
	ALL_CHAT_LIST: (state, getters, rootState) => getClientChats(rootState),
	// ids currently shown in the queue (see visibleChatIds)
	VISIBLE_CHAT_LIST: (state, getters, rootState) => {
		const chatsById = new Map(
			getClientChats(rootState).map((chat) => [
				chat.conversationId,
				chat,
			]),
		);

		return state.visibleChatIds.map((id) => chatsById.get(id)).filter(Boolean);
	},

	HAS_MORE: (state, getters, rootState) =>
		getters.ALL_CHAT_LIST.length > state.visibleChatIds.length,
};

const actions = {
	// subscribe_chat returns at most 40 conversations. Load the rest from REST
	// into conversationStore so they get WS actions, then show the first page.
	RELOAD_CHAT_LIST: async (context) => {
		context.commit('SET_IS_LOADING', true);
		context.commit('SET_VISIBLE_CHAT_IDS', []);
		const { userId } = useUserinfoStore();

		try {
			let page = 1;

			// page through REST until a short/empty response. MAX_RELOAD_PAGES
			// stops the loop if every page comes back full (50 × 40 = 2000 chats).
			while (page <= MAX_RELOAD_PAGES) {
				const { items: dialogs } = await ActiveChatsAPI.getList({
					page,
					size: RELOAD_PAGE_SIZE,
					peerId: userId,
				});

				if (!dialogs.length) break;

				await context.dispatch('ADD_CHAT_LIST_TO_CLIENT_STORE', dialogs);

				if (dialogs.length < RELOAD_PAGE_SIZE) break;
				page += 1;
			}

			const ids = getClientChats(context.rootState).map(
				(chat) => chat.conversationId,
			);

			context.commit('SET_VISIBLE_CHAT_IDS', ids.slice(0, context.state.size));
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
			existingIds.push(dialog.id);
		});
	},

	// show the next `size` chats already sitting in the client
	LOAD_NEXT_ACTIVE_CHATS: (context) => {
		if (context.state.isLoading) return;

		const hiddenIds = getClientChats(context.rootState)
			.map((chat) => chat.conversationId)
			.filter((id) => !context.state.visibleChatIds.includes(id));

		context.commit('SET_VISIBLE_CHAT_IDS', [
			...context.state.visibleChatIds,
			...hiddenIds.slice(0, context.state.size),
		]);
	},

	CHAT_INSERT_TO_START: (context, chat) => {
		const chatId = chat.conversationId;
		context.commit('SET_VISIBLE_CHAT_IDS', [
			chatId,
			...context.state.visibleChatIds.filter((id) => id !== chatId),
		]);
	},
	REMOVE_CHAT: (context, chat) => {
		context.commit(
			'SET_VISIBLE_CHAT_IDS',
			context.state.visibleChatIds.filter((id) => id !== chat.conversationId),
		);
	},
};

const mutations = {
	SET_VISIBLE_CHAT_IDS: (state, ids) => {
		state.visibleChatIds = [
			...new Set(ids),
		];
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
	modules: {
		search,
	},
};
