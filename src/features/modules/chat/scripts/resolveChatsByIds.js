/**
 * Map an ordered list of chat ids to live SDK Conversation instances.
 * Order comes from `chatIds`; objects come from the SDK.
 */
export const getActiveChatListByIds = (listChatIds = [], client) => {
	if (!client) return [];

	return listChatIds
		.map((id) => client.conversationById(id)) // webitel-sdk client method
		.filter(Boolean);
};
