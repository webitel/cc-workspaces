/**
 * Map an ordered list of chat ids to live SDK Conversation instances.
 * Ids unknown to the SDK are skipped.
 * @param {Array<string>} chatIds - ordered display ids
 * @param {object} client - root store `client` (ws client wrapper)
 * @returns {Array<object>} Conversation[]
 */
export const resolveChatsByIds = (chatIds, client) => {
	// TODO: get all SDK conversations, index by id, map chatIds -> Conversation, filter unknown
	return [];
};
