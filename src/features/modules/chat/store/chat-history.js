import { ContactChatMessagesAPI as contactChatMessagesHistory } from '@webitel/api-services/api';
import applyTransform, {
	notify,
} from '@webitel/ui-sdk/src/api/transformers/index';

import i18n from '../../../../app/locale/i18n';
import { formatChatMessages } from '../scripts/formatChatMessages';

const { t } = i18n.global;

const state = {
	chatHistoryMessages: [], // messages from ChatHistoryApi
	page: 1,
	next: false,
};

const actions = {
	LOAD_CHAT_HISTORY: (context, contactId) =>
		context.dispatch('LOAD_PAGE', {
			contactId,
			page: 1,
		}),

	LOAD_NEXT: (context, contactId) => {
		if (!context.state.next) return;

		return context.dispatch('LOAD_PAGE', {
			contactId,
			page: context.state.page + 1,
		});
	},

	// pages run newest to oldest, so a later page is prepended
	LOAD_PAGE: async (context, { contactId, page }) => {
		try {
			const { items, next } = await contactChatMessagesHistory.getAllMessages({
				contactId,
				page,
			});
			const messages = formatChatMessages(items); // make chat-history messages more similar with current-chat messages

			context.commit('SET_PAGE', {
				page,
				next,
				messages:
					page === 1
						? messages
						: [
								...messages,
								...context.state.chatHistoryMessages,
							],
			});
		} catch (err) {
			throw applyTransform(err, [
				notify(({ callback }) =>
					callback({
						type: 'error',
						text: t('errorNotifications.chatHistoryApi'),
					}),
				),
			]);
		}
	},

	RESET_CHAT_HISTORY: (context) => context.commit('RESET_CHAT_HISTORY_STATE'),
};

const mutations = {
	SET_PAGE: (state, { messages, page, next }) => {
		state.chatHistoryMessages = messages;
		state.page = page;
		state.next = next;
	},
	RESET_CHAT_HISTORY_STATE: (state) => {
		state.chatHistoryMessages = [];
		state.page = 1;
		state.next = false;
	},
};

export default {
	namespaced: true,
	state,
	actions,
	mutations,
};
