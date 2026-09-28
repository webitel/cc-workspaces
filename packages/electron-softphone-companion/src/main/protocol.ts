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

/** an error carrying a protocol `ack` code, thrown by command handlers */
export class ProtocolError extends Error {
	code: string;

	constructor(code: string, message?: string) {
		super(message || code);
		this.name = 'ProtocolError';
		this.code = code;
	}
}

// plaintext ws:// is accepted only towards a loopback dev proxy; a packaged
// workspace always reaches its backend over wss://
const LOOPBACK_HOSTS = new Set([
	'localhost',
	'127.0.0.1',
	'::1',
	'[::1]',
]);

/**
 * A `hello` endpoint becomes the backend this utility authenticates against and
 * pulls SIP credentials from, so it is validated as a URL rather than as "a
 * non-empty string" — see also the endpoint allowlist / pairing check in
 * Softphone.handleHello, which decides *which* valid endpoints are acceptable.
 */
export const isValidEndpoint = (value: unknown): value is string => {
	if (typeof value !== 'string' || !value.length) return false;
	let url: URL;
	try {
		url = new URL(value);
	} catch {
		return false;
	}
	if (url.protocol === 'wss:') return true;
	return url.protocol === 'ws:' && LOOPBACK_HOSTS.has(url.hostname);
};

// a superset of the workspace's own sanitizer (src/features/modules/call/
// call.js strips everything outside [0-9a-zA-Z+*#]); the destination is
// concatenated into a SIP URI by the native addon, so characters with meaning
// there (@ ; ? , < >) must never reach it
const DESTINATION_PATTERN = /^[0-9A-Za-z+*#._-]{1,128}$/;

const isPlainObject = (value: unknown): boolean =>
	typeof value === 'object' && value !== null && !Array.isArray(value);

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
		isValidEndpoint(msg.endpoint),
	[MESSAGE_TYPES.TOKEN]: (msg) =>
		typeof msg.token === 'string' && msg.token.length > 0,
	[MESSAGE_TYPES.ANSWER]: (msg) => typeof msg.callId === 'string',
	[MESSAGE_TYPES.CALL]: (msg) =>
		typeof msg.destination === 'string' &&
		DESTINATION_PATTERN.test(msg.destination) &&
		(msg.params === undefined || isPlainObject(msg.params)),
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
	// own-property lookup only: `type: "constructor"` would otherwise resolve to
	// Object through the prototype chain and pass as a validator
	const type = message.type as string;
	const validate = Object.hasOwn(VALIDATORS, type)
		? VALIDATORS[type]
		: undefined;
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
