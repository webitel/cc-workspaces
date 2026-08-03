// Local WebSocket protocol between the web workspace and this utility.
// Envelope: { v: 1, seq?: number, type: string, ...payload }.
// The first message on a connection must be `hello`; commands are acked with
// { type: 'ack', seq, ok, error?: { code, message } }.

export const PROTOCOL_VERSION = 1;

export const MESSAGE_TYPES = {
	// web -> utility
	HELLO: 'hello',
	TOKEN: 'token',
	ANSWER: 'answer',
	CALL: 'call',
	HANGUP: 'hangup',
	PING: 'ping',
	// utility -> web
	STATE: 'state',
	ACK: 'ack',
	PONG: 'pong',
} as const;

export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];

export interface ProtocolEnvelope {
	v: number;
	seq?: number;
	type: MessageType;
}

export interface HelloMessage extends ProtocolEnvelope {
	type: 'hello';
	token: string;
	endpoint: string;
	protocolVersion?: number;
}

export interface TokenMessage extends ProtocolEnvelope {
	type: 'token';
	token: string;
}

export interface AnswerMessage extends ProtocolEnvelope {
	type: 'answer';
	callId: string;
}

export interface CallMessage extends ProtocolEnvelope {
	type: 'call';
	destination: string;
	params?: object;
}

export interface HangupMessage extends ProtocolEnvelope {
	type: 'hangup';
	callId: string;
}

export interface PingMessage extends ProtocolEnvelope {
	type: 'ping';
}

export type InboundMessage =
	| HelloMessage
	| TokenMessage
	| AnswerMessage
	| CallMessage
	| HangupMessage
	| PingMessage;

export interface CommandError {
	code: string;
	message?: string;
}

export interface ParseResult {
	message?: InboundMessage;
	error?: string;
	/** the raw parsed message when an error still has a usable seq */
	raw?: {
		seq?: number;
	};
}

type Validator = (msg: Record<string, unknown>) => boolean;

const VALIDATORS: Partial<Record<string, Validator>> = {
	[MESSAGE_TYPES.HELLO]: (msg) =>
		typeof msg.token === 'string' &&
		msg.token.length > 0 &&
		typeof msg.endpoint === 'string' &&
		msg.endpoint.length > 0,
	[MESSAGE_TYPES.TOKEN]: (msg) =>
		typeof msg.token === 'string' && msg.token.length > 0,
	[MESSAGE_TYPES.ANSWER]: (msg) => typeof msg.callId === 'string',
	[MESSAGE_TYPES.CALL]: (msg) =>
		typeof msg.destination === 'string' && msg.destination.length > 0,
	[MESSAGE_TYPES.HANGUP]: (msg) => typeof msg.callId === 'string',
	[MESSAGE_TYPES.PING]: () => true,
};

export const parseMessage = (raw: string): ParseResult => {
	let msg: unknown;
	try {
		msg = JSON.parse(raw);
	} catch {
		return {
			error: 'malformed_json',
		};
	}
	if (typeof msg !== 'object' || msg === null) {
		return {
			error: 'malformed_message',
		};
	}
	const message = msg as Record<string, unknown>;
	const rawSeq = {
		seq: typeof message.seq === 'number' ? message.seq : undefined,
	};
	if (message.v !== PROTOCOL_VERSION) {
		return {
			error: 'version_mismatch',
			raw: rawSeq,
		};
	}
	const validate = VALIDATORS[message.type as string];
	if (!validate) {
		return {
			error: 'unknown_type',
			raw: rawSeq,
		};
	}
	if (!validate(message)) {
		return {
			error: 'invalid_payload',
			raw: rawSeq,
		};
	}
	return {
		message: message as unknown as InboundMessage,
	};
};
