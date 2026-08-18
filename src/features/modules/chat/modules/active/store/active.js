import { WebSocketConnectionState } from '../../../../../../ui/enums/WebSocketConnectionState.enum.ts';
import { useUserinfoStore } from '../../../../../../ui/modules/userinfo/userinfoStore';
import ActiveChatsAPI from '../api/activeChats';
import { buildConversationFromDialog } from '../scripts/buildConversationFromDialog';
import search from './search';

const PAGE_SIZE = 10;
const RELOAD_PAGE_SIZE = 40;
// cap REST hydration: 50 pages × 40 items = up to 2000 chats loaded into the client
const MAX_RELOAD_PAGES = 50;

// UI reads from the WS client; REST is only a one-time hydrator after page reload
const getClientChats = (rootState) => {
	if (rootState.client.state !== WebSocketConnectionState.Connected) return [];

	const client = rootState.client.getClientSync();
	if (!client) return [];

	return client.allConversations().filter((chat) => !chat.closedAt);
};

const state = {
	visibleChatIds: [],
	size: PAGE_SIZE,
	isLoading: false,
};

const getters = {
	// all non-closed chats in the client — used by counters and HAS_MORE
	ALL_CHAT_LIST: (state, getters, rootState) => getClientChats(rootState),
	// paginated slice for the queue list (first 10, then +10 per More click)
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
	// Bug we hit: REST returns the full active-chat list (and `next`) right away, but the
	// queue renders from `client.allConversations()`. After reload WS knows only ~40 chats;
	// the rest exist in REST but are not in the client yet — no chat item to render, while
	// REST pagination already claims there are more pages. Driving More/visible ids from REST
	// got out of sync with what WS actually had.
	//
	// Fix: on session start, walk REST pages and hydrate every dialog into the WS client first.
	// Only then build visible ids / More / counters from the client — one source of truth for UI.
	RELOAD_CHAT_LIST: async (context) => {
		context.commit('SET_IS_LOADING', true);
		context.commit('SET_VISIBLE_CHAT_IDS', []);
		const { userId } = useUserinfoStore();

		try {
			let page = 1;

			// Pull all REST pages into the client before showing the list. Stop on empty/short
			// page, not on REST `next` — WS must catch up with REST before UI reads it.
			// MAX_RELOAD_PAGES is a safety cap (50 × 40 = 2000 chats) if pages never shorten.
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

	// no REST here — reveal the next page from chats already loaded into the client
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
