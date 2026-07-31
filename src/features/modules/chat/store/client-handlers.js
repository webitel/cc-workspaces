import { ChatActions } from 'webitel-sdk';
// import { ChatDialogsAPI } from '@webitel/api-services/api';
import ActiveChatsAPI from '../modules/active/api/activeChats.js';

import openLinkFromVariable from '../../../../app/scripts/openLinkFromVariable';
import { patchChatEventRouting } from '../modules/active/scripts/patchChatEventRouting.js';

const chatHandler = (context) => async (action, chat) => {
	// TODO: тимчасовий дебаг — чи доходять WS-події до чатів, засетаних з REST
	console.log('[ws event]', action, {
		origin: chat.data?.origin || 'ws',
		conversationId: chat.conversationId,
		channelId: chat.channelId,
		state: chat.state,
		storeKey: chat.id,
		membersId: chat.membersId,
	});

	switch (action) {
		case ChatActions.UserInvite:
			context.dispatch('HANDLE_INVITE_ACTION', {
				action,
				chat,
			});
			break;
		case ChatActions.Joined:
			context.dispatch('HANDLE_JOINED_ACTION', {
				action,
				chat,
			});
			break;
		case ChatActions.Message:
			context.dispatch('HANDLE_MESSAGE_ACTION', {
				action,
				chat,
			});
			break;
		case ChatActions.Decline:
			break;
		case ChatActions.Leave:
			break;
		case ChatActions.Close:
			context.dispatch('HANDLE_CLOSE_ACTION', {
				action,
				chat,
			});
			break;
		case ChatActions.Destroy:
			context.dispatch('HANDLE_DESTROY_ACTION', {
				action,
				chat,
			});
			break;
		default:
	}
};

const actions = {
	SUBSCRIBE_CHATS: async (context) => {
		const client = await context.rootState.client.getCliInstance();
		// до підписки, щоб жоден екшен не пройшов мимо
		patchChatEventRouting(client);
		await client.subscribeChat(chatHandler(context), null);

		// спершу віддаємо в панель те, що прийшло по ws
		const wsChatList = client.allConversations();
		if (wsChatList.length) context.dispatch('SET_CHAT_LIST', wsChatList);

		// далі добираємо решту з рест апішки — ws чати вже в сторі,
		// тому дедуплікації є з чим порівнювати
		await context.dispatch('active/RELOAD_CHAT_LIST');
		context.dispatch('SET_CHAT_LIST', client.allConversations());
	},

	HANDLE_INVITE_ACTION: (context, { action, chat }) => {
		context.dispatch('ADD_CHAT', chat);
		if (context.rootGetters['workspace/IS_EMPTY_WORKSPACE']) {
			context.dispatch('SET_WORKSPACE', chat);
		}
		context.dispatch('HANDLE_CHAT_EVENT', {
			action,
			chat,
		});
	},

	HANDLE_JOINED_ACTION: (context, { chat }) => {
		openLinkFromVariable(chat);
	},

	HANDLE_MESSAGE_ACTION: async (context, { action, chat }) => {
		// if(chat.data?.origin === 'rest')
		console.log('HANDLE_MESSAGE_ACTION chat:', chat, 'action:', action);

		const message = chat.messages[chat.messages.length - 1];
		console.log('HANDLE_MESSAGE_ACTION message:', message);
		const activeChats = await ActiveChatsAPI.getList();
		console.log('after message activeChats:', activeChats.filter);
		if (!context.getters.IS_MY_MESSAGE(message)) {
			context.dispatch('HANDLE_CHAT_EVENT', {
				action,
				chat,
			});
			context.commit('unseen/ADD_UNSEEN_CHAT', chat);
		}
		context.dispatch('CHAT_INSERT_TO_START', chat);
	},

	RESET_CHAT: (context, chat) => {
		context.commit('REMOVE_CHAT', chat);
		context.dispatch('_RESET_UNREAD_COUNT');
		context.dispatch('LOAD_CLOSED_CHATS');

		/**
		 * @author @OleksandrPalonnyi
		 *
		 * [WTEL-9263](https://webitel.atlassian.net/browse/WTEL-9263)
		 *
		 * The backend sends Destroy/Close events asynchronously — by the time this
		 * fires, the user may have already opened a new chat. Only reset workspace
		 * and history if the closed chat is still the one currently displayed.
		 */

		if (context.getters.CHAT_ON_WORKSPACE.channelId === chat.channelId) {
			context.dispatch('RESET_WORKSPACE');
			context.dispatch('RESET_CHAT_HISTORY');
		}
	},

	HANDLE_DESTROY_ACTION: (context, { chat }) => {
		context.dispatch('RESET_CHAT', chat);
	},

	HANDLE_CLOSE_ACTION: (context, { action, chat }) => {
		context.dispatch('HANDLE_CHAT_EVENT', {
			action,
			chat,
		});

		if (!chat.allowReporting) {
			// https://webitel.atlassian.net/browse/WTEL-5631
			context.dispatch('RESET_CHAT', chat);
		}
	},
	HANDLE_CHAT_EVENT: (context, { action, chat }) =>
		context.dispatch(
			'features/chatNotifications/HANDLE_CHAT_EVENT',
			{
				action,
				chat,
			},
			{
				root: true,
			},
		),
	RESET_CHAT_HISTORY: (context) =>
		context.dispatch('features/chat/chatHistory/RESET_CHAT_HISTORY', null, {
			root: true,
		}),
	LOAD_CLOSED_CHATS: (context) =>
		context.dispatch('features/chat/closed/LOAD_CLOSED_CHATS', null, {
			root: true,
		}),
};

export default {
	actions,
};
