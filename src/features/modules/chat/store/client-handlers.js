import { ChatActions } from 'webitel-sdk';

import openLinkFromVariable from '../../../../app/scripts/openLinkFromVariable';

// subscribeChat stacks handlers; reconnect + visibility can both call SUBSCRIBE_CHATS
const subscribedChatClients = new WeakSet();

const chatHandler = (context) => async (action, chat) => {
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

		if (!subscribedChatClients.has(client)) {
			subscribedChatClients.add(client);
			try {
				await client.subscribeChat(chatHandler(context), null);
			} catch (error) {
				subscribedChatClients.delete(client);
				throw error;
			}
		}

		await context.dispatch('active/RELOAD_CHAT_LIST');
	},

	HANDLE_INVITE_ACTION: (context, { action, chat }) => {
		context.dispatch('active/CHAT_INSERT_TO_START', chat);
		if (context.rootGetters['workspace/IS_EMPTY_WORKSPACE']) {
			context.dispatch('SET_WORKSPACE', chat);
		}
		context.dispatch('HANDLE_CHAT_EVENT', {
			action,
			chat,
		});
	},

	HANDLE_JOINED_ACTION: (context, { chat }) => {
		context.dispatch('active/CHAT_INSERT_TO_START', chat);
		openLinkFromVariable(chat);
	},

	HANDLE_MESSAGE_ACTION: async (context, { action, chat }) => {
		const message = chat.messages[chat.messages.length - 1];
		const isMine = context.getters.IS_MY_MESSAGE(message);

		if (!isMine) {
			context.dispatch('HANDLE_CHAT_EVENT', {
				action,
				chat,
			});
			context.commit('unseen/ADD_UNSEEN_CHAT', chat);
		}
		context.dispatch('active/CHAT_INSERT_TO_START', chat);
	},

	RESET_CHAT: (context, chat) => {
		context.dispatch('active/REMOVE_CHAT', chat);
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

		if (
			context.getters.CHAT_ON_WORKSPACE.conversationId === chat.conversationId
		) {
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
