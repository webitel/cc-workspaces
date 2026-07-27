import { resolveChatsByIds } from '../../../scripts/resolveChatsByIds.js';
// import search from './search.js';

// TODO: import active-chats API (page/size/q, onlyClosed=false)

const state = {
	chatIds: [], // порядок відображення (id), НЕ об'єкти
	page: 1,
	size: 10,
	next: false,
	isLoaded: false,
};

const getters = {
	REQUEST_PARAMS: (state) => ({
		// TODO: page, size
	}),
	// id[] -> Conversation[] з SDK
	ACTIVE_CHATS: (state, getters, rootState) => {
		// TODO: return resolveChatsByIds(state.chatIds, rootState.client)
		return [];
	},
};

const actions = {
	LOAD_ACTIVE_CHATS: async (context) => {}, // перша сторінка
	LOAD_NEXT_ACTIVE_CHATS: async (context) => {}, // load more + dedupe по id

	// WS-реакції на рівні id
	INSERT_CHAT_ID_TO_START: (context, chatId) => {}, // новий чат / нове повідомлення -> наверх
	REMOVE_CHAT_ID: (context, chatId) => {}, // закриття -> прибрати, якщо є
};

const mutations = {
	SET_CHAT_IDS: (state, ids) => {
		state.chatIds = ids;
	},
	SET_PAGE: (state, page) => {
		state.page = page;
	},
	SET_NEXT: (state, next) => {
		state.next = next;
	},
	SET_IS_LOADED: (state, value) => {
		state.isLoaded = value;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
	// modules: {
	// 	search,
	// },
};
