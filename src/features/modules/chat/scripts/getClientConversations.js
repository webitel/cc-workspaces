import { WebSocketConnectionState } from '../../../../ui/enums/WebSocketConnectionState.enum.ts';

/**
 * @author @OleksandrPalonnyi
 *
 * [WTEL-9955](https://webitel.atlassian.net/browse/WTEL-9955)
 *
 *  All conversations the WS client holds, closed or not — a closed one stays
 *  here until the SDK destroys it
 * */
export const getAllClientConversations = (rootState) => {
	if (rootState.client.state !== WebSocketConnectionState.Connected) return [];

	const client = rootState.client.getClientSync();
	if (!client) return [];

	return client.allConversations();
};

export const getClientChats = (rootState) =>
	getAllClientConversations(rootState).filter((chat) => !chat.closedAt);
