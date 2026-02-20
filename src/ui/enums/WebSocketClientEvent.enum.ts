export const WebSocketClientEvent = {
	AfterAuth: 'afterAuth',
	Error: 'error',
} as const;

export type WebSocketClientEvent =
	(typeof WebSocketClientEvent)[keyof typeof WebSocketClientEvent];
