import { EventEmitter } from 'node:events';
import type { IncomingMessage } from 'node:http';
import { type WebSocket, WebSocketServer } from 'ws';
import type { SoftphoneAppConfig } from './config';
import * as logger from './logger';
import {
	type CommandError,
	type HelloMessage,
	type InboundMessage,
	MESSAGE_TYPES,
	PROTOCOL_VERSION,
	parseMessage,
} from './protocol';

export type ReplyFn = (ok: boolean, error?: CommandError | null) => void;

interface LocalServerEvents {
	hello: [
		message: HelloMessage,
		reply: ReplyFn,
	];
	command: [
		message: InboundMessage,
		reply: ReplyFn,
	];
	'clients-changed': [
		count: number,
	];
	'server-error': [
		err: NodeJS.ErrnoException,
	];
	listening: [];
}

type LocalSocket = WebSocket & {
	helloReceived?: boolean;
};

// Local control channel for web workspace clients. Binds to loopback only.
// A connection may send commands only after a valid `hello`; the hello token
// is authenticated downstream by connecting to the Webitel backend with it.
class LocalServer extends EventEmitter<LocalServerEvents> {
	#wss: WebSocketServer | null = null;
	#config: SoftphoneAppConfig;

	constructor(config: SoftphoneAppConfig) {
		super();
		this.#config = config;
	}

	start(): void {
		this.#wss = new WebSocketServer({
			host: '127.0.0.1',
			port: this.#config.port,
		});

		this.#wss.on('error', (err: NodeJS.ErrnoException) => {
			logger.error('[local-server] server error', err);
			this.emit('server-error', err);
		});

		this.#wss.on('listening', () => {
			logger.log(`[local-server] listening on 127.0.0.1:${this.#config.port}`);
			this.emit('listening');
		});

		this.#wss.on('connection', (socket: LocalSocket, req: IncomingMessage) => {
			if (!this.#isOriginAllowed(req.headers.origin)) {
				logger.error(`[local-server] rejected origin ${req.headers.origin}`);
				socket.close(4003, 'origin_not_allowed');
				return;
			}
			socket.helloReceived = false;
			logger.log(
				`[local-server] connection from ${req.headers.origin || 'unknown origin'}`,
			);

			socket.on('message', (raw) => this.#onMessage(socket, raw.toString()));
			socket.on('close', () =>
				this.emit('clients-changed', this.clientCount()),
			);
			socket.on('error', (err) =>
				logger.error('[local-server] socket error', err),
			);

			this.emit('clients-changed', this.clientCount());
		});
	}

	#isOriginAllowed(origin: string | undefined): boolean {
		const allowlist = this.#config.originAllowlist;
		if (!Array.isArray(allowlist) || !allowlist.length) return true;
		return typeof origin === 'string' && allowlist.includes(origin);
	}

	#onMessage(socket: LocalSocket, raw: string): void {
		const { message, error, raw: rawEnvelope } = parseMessage(raw);
		if (error || !message) {
			this.#send(socket, {
				type: MESSAGE_TYPES.ACK,
				seq: rawEnvelope?.seq ?? null,
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

	#replier(socket: LocalSocket, seq: number | undefined): ReplyFn {
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

	#send(socket: LocalSocket, payload: object): void {
		if (socket.readyState !== socket.OPEN) return;
		socket.send(
			JSON.stringify({
				v: PROTOCOL_VERSION,
				...payload,
			}),
		);
	}

	broadcastState(state: object): void {
		if (!this.#wss) return;
		for (const socket of this.#wss.clients as Set<LocalSocket>) {
			if (!socket.helloReceived) continue;
			this.#send(socket, {
				type: MESSAGE_TYPES.STATE,
				...state,
			});
		}
	}

	clientCount(): number {
		return this.#wss ? this.#wss.clients.size : 0;
	}

	stop(): void {
		if (this.#wss) this.#wss.close();
		this.#wss = null;
	}
}

export default LocalServer;
