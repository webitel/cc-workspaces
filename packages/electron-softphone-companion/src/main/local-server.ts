import { EventEmitter } from 'node:events';
import type { IncomingMessage } from 'node:http';
import { type WebSocket, WebSocketServer } from 'ws';
import { config, type SoftphoneAppConfig } from './config';
import * as logger from './logger';
import {
	type CommandError,
	type HelloMessage,
	type InboundMessage,
	MESSAGE_TYPES,
	PROTOCOL_VERSION,
	ProtocolError,
	parseMessage,
} from './protocol';

export type ReplyFn = (ok: boolean, error?: CommandError | null) => void;

/**
 * Handles a `hello` and resolves once the session it asks for is accepted.
 * Rejecting (with a ProtocolError, ideally) makes the server ack the failure
 * and close the connection without ever granting it command rights.
 */
export type HelloHandler = (
	message: HelloMessage,
	origin: string | null,
) => Promise<void>;

// hello frames a connection may send per window before it is dropped: an
// accepted hello that changes the credentials runs a full SIP teardown/register
// cycle, so this is what keeps a hello storm from thrashing the registration.
// The workspace legitimately re-sends hello on every client generation (token
// re-handoff), hence a sliding window rather than a lifetime count.
const MAX_HELLO_ATTEMPTS = 5;
const HELLO_WINDOW_MS = 60_000;
// largest frame accepted; the protocol's biggest payload is a token
const MAX_PAYLOAD_BYTES = 64 * 1024;

interface LocalServerEvents {
	'hello-accepted': [];
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
	helloPending?: boolean;
	helloAttempts?: number;
	helloWindowStart?: number;
	origin?: string | null;
};

// Local control channel for web workspace clients. Binds to loopback only.
// A connection may send commands only after a valid `hello`; the hello token
// is authenticated downstream by connecting to the Webitel backend with it.
class LocalServer extends EventEmitter<LocalServerEvents> {
	#wss: WebSocketServer | null = null;
	#config: SoftphoneAppConfig;
	#onHello: HelloHandler = async () => {};

	constructor(conf: SoftphoneAppConfig) {
		super();
		this.#config = conf;
	}

	/** must be set before start(): no connection can be accepted without it */
	set onHello(handler: HelloHandler) {
		this.#onHello = handler;
	}

	start(): void {
		this.#wss = new WebSocketServer({
			host: '127.0.0.1',
			port: this.#config.port,
			maxPayload: MAX_PAYLOAD_BYTES,
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
			socket.helloAttempts = 0;
			socket.helloWindowStart = Date.now();
			socket.origin = req.headers.origin ?? null;
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

	// An explicit allowlist wins. Otherwise the pairing decides: once this
	// utility is paired with a workspace, only that workspace's own origin may
	// connect — which is what keeps any other page the operator happens to open
	// (WebSocket connections are not subject to the same-origin policy) off the
	// control channel. Before the first pairing there is nothing to compare
	// against, so the channel stays open; that window is closed by the endpoint
	// check in Softphone.handleHello.
	#isOriginAllowed(origin: string | undefined): boolean {
		const { originAllowlist, pairedWorkspace } = config();
		if (Array.isArray(originAllowlist) && originAllowlist.length) {
			return typeof origin === 'string' && originAllowlist.includes(origin);
		}
		if (!pairedWorkspace?.origin) return true;
		return origin === pairedWorkspace.origin;
	}

	#helloWithinRateLimit(socket: LocalSocket): boolean {
		const now = Date.now();
		if (now - (socket.helloWindowStart ?? 0) > HELLO_WINDOW_MS) {
			socket.helloWindowStart = now;
			socket.helloAttempts = 0;
		}
		socket.helloAttempts = (socket.helloAttempts ?? 0) + 1;
		return socket.helloAttempts <= MAX_HELLO_ATTEMPTS;
	}

	async #onMessage(socket: LocalSocket, raw: string): Promise<void> {
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

		// hello is also the token re-handoff: the workspace re-sends it on every
		// client generation, so it stays valid on an established connection
		if (message.type === MESSAGE_TYPES.HELLO) {
			if (socket.helloPending) return;
			if (!this.#helloWithinRateLimit(socket)) {
				socket.close(4008, 'too_many_hellos');
				return;
			}
			socket.helloPending = true;
			const reply = this.#replier(socket, message.seq);
			try {
				await this.#onHello(message, socket.origin ?? null);
				// command rights are granted only once the hello is actually
				// accepted — a client whose session is refused never gets them
				socket.helloReceived = true;
				reply(true);
				this.emit('hello-accepted');
			} catch (err) {
				logger.error('[local-server] hello rejected', err);
				reply(false, {
					code: err instanceof ProtocolError ? err.code : 'hello_failed',
					message: (err as Error).message,
				});
				socket.close(4002, 'hello_failed');
			} finally {
				socket.helloPending = false;
			}
			return;
		}

		if (!socket.helloReceived) {
			socket.close(4001, 'hello_expected');
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
