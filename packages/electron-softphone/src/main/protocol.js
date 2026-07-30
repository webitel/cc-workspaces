// Local WebSocket protocol between the web workspace and this utility.
// Envelope: { v: 1, seq?: number, type: string, ...payload }.
// The first message on a connection must be `hello`; commands are acked with
// { type: 'ack', seq, ok, error?: { code, message } }.

const PROTOCOL_VERSION = 1;

const MESSAGE_TYPES = {
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
};

const VALIDATORS = {
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

const parseMessage = (raw) => {
	let msg;
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
	if (msg.v !== PROTOCOL_VERSION) {
		return {
			error: 'version_mismatch',
			message: msg,
		};
	}
	const validate = VALIDATORS[msg.type];
	if (!validate)
		return {
			error: 'unknown_type',
			message: msg,
		};
	if (!validate(msg))
		return {
			error: 'invalid_payload',
			message: msg,
		};
	return {
		message: msg,
	};
};

module.exports = {
	PROTOCOL_VERSION,
	MESSAGE_TYPES,
	parseMessage,
};
