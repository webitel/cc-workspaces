// Active chats come from webitel-sdk, where the "id" getter returns
// channelId || inviteId || conversationId. Closed chats come from the API
// and are identified by conversation id only. conversationId is the one
// key shared by both worlds — deriving it is this module's private concern.
const getUnseenChatId = (chat) => chat.conversationId || chat.id;

const state = {
	unseenChatIds: [], // conversation ids with activity the agent hasn't seen yet
};

const getters = {
	IS_CHAT_UNSEEN: (state) => (chat) =>
		state.unseenChatIds.includes(getUnseenChatId(chat)),
};

const actions = {
	// The "seen" authority for the open live chat is useChatScroll:
	// it dispatches this when the agent actually reaches the bottom.
	MARK_CHAT_SEEN: (context, chat) => {
		context.commit('REMOVE_UNSEEN_CHAT', chat);
	},
};

const mutations = {
	ADD_UNSEEN_CHAT: (state, chat) => {
		const id = getUnseenChatId(chat);
		if (!state.unseenChatIds.includes(id)) state.unseenChatIds.push(id);
	},
	REMOVE_UNSEEN_CHAT: (state, chat) => {
		const id = getUnseenChatId(chat);
		state.unseenChatIds = state.unseenChatIds.filter((item) => item !== id);
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
