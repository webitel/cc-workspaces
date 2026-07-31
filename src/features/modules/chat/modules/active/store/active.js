import { getActiveChatListByIds } from '../../../scripts/resolveChatsByIds.js';
import ActiveChatsAPI from '../api/activeChats.js';
import { buildConversationFromDialog } from '../scripts/buildConversationFromDialog.js';
// TODO: тимчасовий дебаг мапінгу — видалити
import { debugActiveChatsMapping } from '../scripts/debugActiveChatsMapping.js';
import { getTasksByConversationId } from '../scripts/getTasksByConversationId.js';
// import search from './search.js';

const RELOAD_PAGE_SIZE = 100;

const state = {
	chatIds: [], // порядок відображення (id), НЕ об'єкти
	page: 1,
	size: 10,
	next: false,
	isLoaded: false,
};

const getters = {
	// REQUEST_PARAMS: (state) => ({
	// 	// TODO: page, size
	// }),
	// id[] -> Conversation[] з SDK
	// ACTIVE_CHATS: (state, getters, rootState) => {
	// 	// TODO: return getActiveChatListByIds(state.chatIds, rootState.client)
	// 	return [];
	// },
};

const actions = {
	// @author ye-pohranichna
	// get all chats from REST API and set to WS to provide all WS actions to all active chats
	// by default WS server-part return only 40 chats after page reload
	RELOAD_CHAT_LIST: async (context) => {
		const client = await context.rootState.client.getCliInstance();

		// таски агента: єдине локальне джерело каналу, черги й післяобробки
		const tasksByConversationId = getTasksByConversationId(client);

		const dialogs = [];
		let page = 1;
		let hasNext = true;

		while (hasNext) {
			const { items, next } = await ActiveChatsAPI.getList({
				page,
				size: 10,
				fields: [
					'id',
					'via',
					'from',
					'message',
					'members',
					'queue',
					'context',
				],
			});

			dialogs.push(...items);
			hasNext = next;
			page += 1;
		}
		// console.log('all rest dialogs:', dialogs);

		// знімок стора робимо ПІСЛЯ запитів: поки тягнули сторінки, у стор могли
		// доїхати ws чати. Ключ — conversationId, бо сам стор індексований по channelId
		const existing = new Set(
			client.allConversations().map((c) => c.conversationId),
		);

		dialogs.forEach((dialog) => {
			// чат уже є — або прийшов по ws, або ми його засетали раніше
			if (existing.has(dialog.id)) return;

			const conversation = buildConversationFromDialog({
				client,
				dialog,
				// task: tasksByConversationId.get(dialog.id) || null,
			});

			// ключ саме conversation.id, як робить сам SDK у subscribeChat:
			// після setAnswered це channelId, без нього — conversationId
			client.conversationStore.set(conversation.id, conversation);
			existing.add(dialog.id);
		});

		// TODO: тимчасовий дебаг — видалити разом із debugActiveChatsMapping.js
		debugActiveChatsMapping({
			client,
			dialogs,
		});

		// context.commit(
		// 	'SET_CHAT_IDS',
		// 	dialogs.map(({ id }) => id),
		// );
		context.commit('SET_NEXT', false);
		context.commit('SET_IS_LOADED', true);
	},
	LOAD_ACTIVE_CHATS: async (context) => {},
	LOAD_NEXT_ACTIVE_CHATS: async (context) => {}, // load more + dedupe по id

	INSERT_CHAT_ID_TO_START: (context, chatId) => {
		const without = context.state.chatIds.filter((id) => id !== chatId);
		context.commit('SET_CHAT_IDS', [
			chatId,
			...without,
		]);
	},
	REMOVE_CHAT: (context, chatId) => {}, // закриття -> прибрати, якщо є
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
