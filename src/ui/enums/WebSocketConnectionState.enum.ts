export const WebSocketConnectionState = {
	Idle: 'idle',
	Connecting: 'connecting',
	Connected: 'connected',
	Reconnecting: 'reconnecting',
	Disconnected: 'disconnected',
} as const;

export type WebSocketConnectionState =
	(typeof WebSocketConnectionState)[keyof typeof WebSocketConnectionState];
