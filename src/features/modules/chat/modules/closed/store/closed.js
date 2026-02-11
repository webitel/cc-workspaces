import applyTransform, {
	notify,
} from '@webitel/ui-sdk/src/api/transformers/index.js';

import AgentChatsAPI from '../../../../../../app/api/agent-workspace/endpoints/agent-info/agent-chats';
import i18n from '../../../../../../app/locale/i18n';
import processed from '../modules/processed/store/processed';
import unprocessed from '../modules/unprocessed/store/unprocessed';

const { t } = i18n.global;

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
};

export default {
	namespaced: true,
	getters,
	actions,
	modules: {
		unprocessed,
		processed,
	},
};
