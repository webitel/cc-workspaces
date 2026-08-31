import { getAllClientConversations } from '../../../scripts/getClientConversations';

const getters = {
	/**
	 * @author @OleksandrPalonnyi
	 *
	 * [WTEL-9955](https://webitel.atlassian.net/browse/WTEL-9955)
	 *
	 * postProcessingChats (local, from the SDK store) and the backend's
	 * unprocessed list are two independent sources for the same chat during the
	 * post-processing window: the SDK keeps it until it destroys the
	 * conversation object, while the backend's unprocessed list picks the same
	 * chat up once agent post-processing finishes — for a while both contain
	 * it. Drop chats already present in the backend list so they don't render
	 * twice.
	 * */
	VISIBLE_LIST: (state, getters, rootState) => {
		const unprocessedIds = new Set(
			rootState.features.chat.closed.unprocessed.chatsList.map(
				(chat) => chat.id,
			),
		);

		return getAllClientConversations(rootState)
			.filter((chat) => chat.closedAt)
			.filter((chat) => !unprocessedIds.has(chat.conversationId));
	},
};

export default {
	namespaced: true,
	getters,
};
