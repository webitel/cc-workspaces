// Active chats come from webitel-sdk, where the "id" getter returns
// channelId || inviteId || conversationId. Closed chats come from the API
// and are identified by conversation id only. conversationId is the one
// key shared by both worlds — deriving it is this module's private concern.
const getUnseenChatId = (chat) => chat?.conversationId || chat?.id;

const state = {
	unseenChatIds: {},
};

const getters = {
	IS_CHAT_UNSEEN: (state) => (chat) =>
		!!state.unseenChatIds[getUnseenChatId(chat)],
	UNSEEN_COUNT: (state) => (chat) =>
		state.unseenChatIds[getUnseenChatId(chat)] || 0,
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
		if (!id) return;
		state.unseenChatIds[id] = (state.unseenChatIds[id] || 0) + 1;
	},
	REMOVE_UNSEEN_CHAT: (state, chat) => {
		const id = getUnseenChatId(chat);
		if (!id) return;
		delete state.unseenChatIds[id];
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
