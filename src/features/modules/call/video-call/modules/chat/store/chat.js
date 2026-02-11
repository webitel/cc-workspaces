import {
	isMemberTypeBot,
	isSelfSideChatMessage,
} from '../../../../../chat/scripts/formatChatMessages';

const state = {};

const getters = {
	VIDEO_CALL_CHAT: (state, getters, rootState, rootGetters) =>
		rootGetters['features/call/videoCall/IS_VIDEO_CALL'] &&
		rootGetters['features/call/CALL_ON_WORKSPACE']?.conversation,

	VIDEO_CALL_CHAT_MESSAGES: (state, getters) =>
		getters.VIDEO_CALL_CHAT.messages?.map((message) => ({
			...message,
			member: {
				...message.member,
				/* @author ye.pohranichna
				 * on Workspace we don't get from backend info about bot message type  */
				type: message.member?.type || (isMemberTypeBot(message) && 'bot'),
				self: isSelfSideChatMessage(message),
			},
		})),
};

export default {
	namespaced: true,
	state,
	getters,
};
