const { EventEmitter } = require('node:events');
const { WebSocketServer } = require('ws');
const logger = require('./logger');
const { MESSAGE_TYPES, PROTOCOL_VERSION, parseMessage } = require('./protocol');

// Local control channel for web workspace clients. Binds to loopback only.
// A connection may send commands only after a valid `hello`; the hello token
// is authenticated downstream by connecting to the Webitel backend with it.
class LocalServer extends EventEmitter {
	#wss = null;
	#config;

	constructor(config) {
		super();
		this.#config = config;
	}

	start() {
		this.#wss = new WebSocketServer({
			host: '127.0.0.1',
			port: this.#config.port,
		});

		this.#wss.on('error', (err) => {
			logger.error('[local-server] server error', err);
			this.emit('server-error', err);
		});

		this.#wss.on('listening', () => {
			logger.log(`[local-server] listening on 127.0.0.1:${this.#config.port}`);
			this.emit('listening');
		});

		this.#wss.on('connection', (socket, req) => {
			if (!this.#isOriginAllowed(req.headers.origin)) {
				logger.error(`[local-server] rejected origin ${req.headers.origin}`);
				socket.close(4003, 'origin_not_allowed');
				return;
			}
			socket.helloReceived = false;
			logger.log(
				`[local-server] connection from ${req.headers.origin || 'unknown origin'}`,
			);

			socket.on('message', (raw) => this.#onMessage(socket, raw));
			socket.on('close', () =>
				this.emit('clients-changed', this.clientCount()),
			);
			socket.on('error', (err) =>
				logger.error('[local-server] socket error', err),
			);

			this.emit('clients-changed', this.clientCount());
		});
	}

	#isOriginAllowed(origin) {
		const allowlist = this.#config.originAllowlist;
		if (!Array.isArray(allowlist) || !allowlist.length) return true;
		return allowlist.includes(origin);
	}

	#onMessage(socket, raw) {
		const { message, error } = parseMessage(raw);
		if (error) {
			this.#send(socket, {
				type: MESSAGE_TYPES.ACK,
				seq: message?.seq ?? null,
				ok: false,
				error: {
					code: error,
					message: `protocol v${PROTOCOL_VERSION} expected`,
				},
			});
			return;
		}

		if (!socket.helloReceived) {
			if (message.type !== MESSAGE_TYPES.HELLO) {
				socket.close(4001, 'hello_expected');
				return;
			}
			socket.helloReceived = true;
			this.emit('hello', message, this.#replier(socket, message.seq));
			return;
		}

		if (message.type === MESSAGE_TYPES.PING) {
			this.#send(socket, {
				type: MESSAGE_TYPES.PONG,
			});
			return;
		}

		this.emit('command', message, this.#replier(socket, message.seq));
	}

	#replier(socket, seq) {
		return (ok, error = null) =>
			this.#send(socket, {
				type: MESSAGE_TYPES.ACK,
				seq: seq ?? null,
				ok,
				...(error
					? {
							error,
						}
					: {}),
			});
	}

	#send(socket, payload) {
		if (socket.readyState !== socket.OPEN) return;
		socket.send(
			JSON.stringify({
				v: PROTOCOL_VERSION,
				...payload,
			}),
		);
	}

	broadcastState(state) {
		if (!this.#wss) return;
		for (const socket of this.#wss.clients) {
			if (!socket.helloReceived) continue;
			this.#send(socket, {
				type: MESSAGE_TYPES.STATE,
				...state,
			});
		}
	}

	clientCount() {
		return this.#wss ? this.#wss.clients.size : 0;
	}

	stop() {
		if (this.#wss) this.#wss.close();
		this.#wss = null;
	}
}

module.exports = LocalServer;
