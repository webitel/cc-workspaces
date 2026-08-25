import { WebSocketConnectionState } from '../../../../ui/enums/WebSocketConnectionState.enum.ts';

// All conversations the WS client currently holds, closed or not. Empty
// until the socket is connected. A closed conversation stays here — and
// keeps updating reactively — until the SDK actually destroys it, which can
// lag well behind the close event while the agent's post-processing/reporting
// task is still open.
export const getAllClientConversations = (rootState) => {
	if (rootState.client.state !== WebSocketConnectionState.Connected) return [];

	const client = rootState.client.getClientSync();
	if (!client) return [];

	return client.allConversations();
};

export const getClientChats = (rootState) =>
	getAllClientConversations(rootState).filter((chat) => !chat.closedAt);
