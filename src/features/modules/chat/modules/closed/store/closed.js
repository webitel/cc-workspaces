import { contactChatMessagesHistory } from '@webitel/ui-sdk/src/api/clients/index.js';
import applyTransform, {
	notify,
} from '@webitel/ui-sdk/src/api/transformers/index.js';

import AgentChatsAPI from '../../../../../../app/api/agent-workspace/endpoints/agent-info/agent-chats';
import CatalogAPI from '../../../../../../app/api/agent-workspace/endpoints/catalog/CatalogAPIRepository.js';
import i18n from '../../../../../../app/locale/i18n';
import { formatChatMessages } from '../../../scripts/formatChatMessages.js';
import processed from '../modules/processed/store/processed';
import unprocessed from '../modules/unprocessed/store/unprocessed';

const { t } = i18n.global;

const state = {
	isClosedChatLoading: false,
	closedChatFirstMessageId: null,
};

const getters = {
	IS_CHAT_ON_WORKSPACE_CLOSED: (state, getters, rootState, rootGetters) =>
		!!rootGetters['features/chat/CHAT_ON_WORKSPACE'].closedAt,
	ALL_CLOSED_CHATS: (state) => [
		...state.unprocessed.chatsList,
		...state.processed.chatsList,
	],
};

const actions = {
	LOAD_CLOSED_CHATS: async (context) => {
		await context.dispatch('LOAD_UNPROCESSED');
		await context.dispatch('LOAD_PROCESSED');
	},
	MARK_AS_PROCESSED: async (context, chat) => {
		try {
			await AgentChatsAPI.markChatProcessed(chat.id);
			await context.dispatch('LOAD_CLOSED_CHATS');
		} catch (err) {
			throw applyTransform(err, [
				notify(({ callback }) =>
					callback({
						type: 'error',
						text: t('errorNotifications.markChatProcessed'),
					}),
				),
			]);
		}
	},
	LOAD_UNPROCESSED: (context) =>
		context.dispatch(
			'features/chat/closed/unprocessed/LOAD_UNPROCESSED_CHATS',
			null,
			{
				root: true,
			},
		),
	LOAD_PROCESSED: (context) =>
		context.dispatch(
			'features/chat/closed/processed/LOAD_PROCESSED_CHATS',
			null,
			{
				root: true,
			},
		),

	LOAD_CLOSED_CHAT: async (context, chat) => {
		try {
			context.commit('SET_IS_CLOSED_CHAT_LOADING', true);

			const { items } = await CatalogAPI.getChatMessagesList({
				chatId: chat.id,
			});

			// wtf? – https://webitel.atlassian.net/browse/WTEL-5515?focusedCommentId=641895
			chat.messages = formatChatMessages(items);
		} finally {
			context.commit('SET_IS_CLOSED_CHAT_LOADING', false);
		}
	},

	LOAD_CLOSED_CHAT_HISTORY: async (context, chat) => {
		const contactId = chat.contact.id;
		const targetChatId = chat.id;
		const getTargetChatFirstMessage = () => {
			// try to find first message of needed chat
			const { chatHistoryMessages, next } =
				context.rootState.features.chat.chatHistory;

			return chatHistoryMessages.find((message, index) => {
				const prevMessage = chatHistoryMessages[index - 1];
				const isChatStart =
					((index === 0 && !next) || prevMessage) && // if noprevMessage - it must be end of chat history
					message.chat?.id !== prevMessage?.chat?.id;
				// if(message.chat?.id === targetChatId
				// 	&& isChatStart) console.log('nextMessage.text:', chatHistoryMessages[index + 1].text)
				return message.chat?.id === targetChatId && isChatStart;
			});
		};
		const findTargetClosedChat = async () => {
			const next = context.rootState.features.chat.chatHistory.next;
			if (!next) return;

			const closedChatFirstMessage = getTargetChatFirstMessage();
			console.log(
				'findTargetClosedChat: closedChatFirstMessage',
				closedChatFirstMessage,
			);

			if (closedChatFirstMessage) {
				context.commit(
					'SET_CLOSED_CHAT_FIRST_MESSAGE_ID',
					closedChatFirstMessage.id,
				);
				await context.dispatch('features/chat/SET_WORKSPACE', chat, {
					root: true,
				});
				return;
			}

			await context.dispatch('features/chat/chatHistory/LOAD_NEXT', contactId, {
				root: true,
			});
			await findTargetClosedChat();
		};

		try {
			context.commit('SET_IS_CLOSED_CHAT_LOADING', true);
			await context.dispatch(
				'features/chat/chatHistory/LOAD_CHAT_HISTORY',
				contactId,
				{
					root: true,
				},
			);

			await findTargetClosedChat();
		} catch (err) {
			throw err;
		} finally {
			context.commit('SET_IS_CLOSED_CHAT_LOADING', false);
		}
	},

	OPEN_CLOSED_CHAT: async (context, chat) => {
		let messagesList;

		if (!chat.contact?.id) {
			await context.dispatch('LOAD_CLOSED_CHAT', chat);
		} else {
			await context.dispatch('LOAD_CLOSED_CHAT_HISTORY', chat);
		}
	},
};

const mutations = {
	SET_CLOSED_CHAT_FIRST_MESSAGE_ID: (state, messageId) => {
		state.closedChatFirstMessageId = messageId;
	},
	SET_IS_CLOSED_CHAT_LOADING: (state, boolean) => {
		state.isClosedChatLoading = boolean;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
	modules: {
		unprocessed,
		processed,
	},
};
