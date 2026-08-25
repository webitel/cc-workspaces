import { getAllClientConversations } from '../../../scripts/getClientConversations';

const getters = {
	/**
	 * @author @OleksandrPalonnyi
	 *
	 * [WTEL-9955](https://webitel.atlassian.net/browse/WTEL-9955)
	 *
	 * Chats closed on the client but not yet destroyed by the SDK. The
	 * closed/unprocessed REST list only reflects a chat once the agent's
	 * post-processing task actually ends, so relying on it alone leaves the
	 * chat invisible in the queue for the whole post-processing window.
	 *
	 * comment [WTEL-9955](https://webitel.atlassian.net/browse/WTEL-9955?focusedCommentId=779325)
	 */
	LIST: (state, getters, rootState) =>
		getAllClientConversations(rootState).filter((chat) => chat.closedAt),
};

export default {
	namespaced: true,
	getters,
};
