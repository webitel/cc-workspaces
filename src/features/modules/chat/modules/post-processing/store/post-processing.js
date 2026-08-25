import { getAllClientConversations } from '../../../scripts/getClientConversations';

const getters = {
	/**
	 * @author @OleksandrPalonnyi
	 *
	 * [WTEL-9955](https://webitel.atlassian.net/browse/WTEL-9955)
	 *
	 * Chats closed locally but not yet destroyed by the SDK (post-processing window)
	 * */
	LIST: (state, getters, rootState) =>
		getAllClientConversations(rootState).filter((chat) => chat.closedAt),
};

export default {
	namespaced: true,
	getters,
};
