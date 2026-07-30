const { EventEmitter } = require('node:events');
const { app } = require('electron');
const { Client } = require('webitel-sdk');
const SipAdapter = require('./sip-adapter');
const logger = require('./logger');
const { PROTOCOL_VERSION } = require('./protocol');

const STATES = {
	IDLE: 'idle', // waiting for a workspace hello
	CONNECTING: 'connecting', // SDK socket connect + auth
	REGISTERING: 'registering', // SIP REGISTER in flight
	REGISTERED: 'registered',
	ERROR: 'error',
};

const RECONNECT_BASE_DELAY = 1000;
const MAX_RECONNECT_DELAY = 15000;
const ANSWER_SIP_RETRY_INTERVAL = 150;
const ANSWER_SIP_RETRY_TIMEOUT = 2000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Owns the webitel-sdk Client (own socket, control plane) and the native SIP
// adapter (media plane). Web workspaces deliver credentials via `hello` and
// drive answer/call; everything else (agent session, hold, transfer, ...)
// stays on the web app's own socket.
class Softphone extends EventEmitter {
	#config;
	#cli = null;
	#adapter = null;
	#token = null;
	#endpoint = null;
	#state = STATES.IDLE;
	#lastError = null;
	#reconnectTimer = null;
	#reconnectAttempts = 0;
	#generation = 0;
	#answersInFlight = new Set();

	constructor(config) {
		super();
		this.#config = config;
	}

	getState() {
		return {
			state: this.#state,
			sdkConnected:
				this.#state === STATES.REGISTERING || this.#state === STATES.REGISTERED,
			sipRegistered: this.#state === STATES.REGISTERED,
			extension: this.#adapter ? this.#adapter.extension : null,
			appVersion: app.getVersion(),
			protocolVersion: PROTOCOL_VERSION,
			platform: process.platform,
			lastError: this.#lastError,
		};
	}

	#setState(state, lastError = null) {
		this.#state = state;
		this.#lastError = lastError;
		this.emit('state', this.getState());
	}

	// `hello {token, endpoint}` from a web client. Reconnect only when the
	// credentials actually changed or nothing is running yet.
	async handleHello({ token, endpoint }) {
		const sameSession =
			this.#cli && this.#token === token && this.#endpoint === endpoint;
		this.#token = token;
		this.#endpoint = endpoint;
		if (sameSession) return;
		await this.restart();
	}

	// token refresh: kept in memory only, used on the next (re)connect
	updateToken(token) {
		this.#token = token;
	}

	async restart() {
		this.#clearReconnect();
		this.#reconnectAttempts = 0;
		await this.#teardown();
		await this.#start();
	}

	async #start() {
		if (!this.#token || !this.#endpoint) return;
		const generation = ++this.#generation;
		this.#setState(STATES.CONNECTING);
		try {
			const cli = new Client({
				endpoint: this.#endpoint,
				token: this.#token,
				registerWebDevice: false,
				debug: this.#config.debug,
				applicationName: 'softphone',
			});
			this.#cli = cli;

			cli.on('disconnected', (code, err) => {
				if (generation !== this.#generation) return;
				logger.error('[softphone] sdk disconnected', code, err);
				this.#scheduleReconnect();
			});

			await cli.connect();
			await cli.auth();
			// populates cli.callStore so cli.answer()/hangup() can find calls;
			// also lets the SDK honor server-side autoAnswer
			await cli.subscribeCall(() => this.emit('calls-changed', cli.allCall()));

			const adapter = new SipAdapter({
				debug: this.#config.debug,
			});
			this.#adapter = adapter;
			adapter.on('registered', () => {
				if (generation !== this.#generation) return;
				this.#setState(STATES.REGISTERED);
			});
			adapter.on('unregistered', () => {
				if (generation !== this.#generation) return;
				if (this.#state === STATES.REGISTERED) {
					this.#setState(STATES.REGISTERING);
				}
			});

			// manual registerCallClient(): the SDK helper passes only the raw
			// user_default_device response to register(), while pjsip also needs
			// register_sec/codecs/nat from local config
			cli.phone = adapter;
			cli.subscribePhone(adapter);
			this.#setState(STATES.REGISTERING);
			const device = await cli.deviceConfig('sip');
			await adapter.register({
				register_sec: this.#config.sipRegisterSec,
				codecs: this.#config.codecs,
				...(this.#config.nat
					? {
							nat: this.#config.nat,
						}
					: {}),
				...device,
			});
			this.#reconnectAttempts = 0;
		} catch (err) {
			if (generation !== this.#generation) return;
			logger.error('[softphone] start failed', err);
			this.#setState(STATES.ERROR, this.#errorCode(err));
			this.#scheduleReconnect();
		}
	}

	#errorCode(err) {
		const message = (err && err.message) || String(err);
		if (/device|not found/i.test(message)) return 'register_failed';
		if (/auth|token|401/i.test(message)) return 'auth_failed';
		return message;
	}

	#scheduleReconnect() {
		this.#clearReconnect();
		const delay = Math.min(
			RECONNECT_BASE_DELAY * 2 ** this.#reconnectAttempts,
			MAX_RECONNECT_DELAY,
		);
		this.#reconnectAttempts += 1;
		logger.log(`[softphone] reconnect in ${delay}ms`);
		this.#reconnectTimer = setTimeout(async () => {
			await this.#teardown();
			await this.#start();
		}, delay);
	}

	#clearReconnect() {
		if (this.#reconnectTimer) clearTimeout(this.#reconnectTimer);
		this.#reconnectTimer = null;
	}

	async #teardown() {
		this.#generation += 1;
		this.#answersInFlight.clear();
		const adapter = this.#adapter;
		const cli = this.#cli;
		this.#adapter = null;
		this.#cli = null;
		if (adapter) {
			try {
				await adapter.unregister();
			} catch (err) {
				logger.error('[softphone] unregister failed', err);
			}
			try {
				await adapter.destroy();
			} catch (err) {
				logger.error('[softphone] adapter destroy failed', err);
			}
		}
		if (cli) {
			try {
				cli.phone = null;
				await cli.destroy();
			} catch (err) {
				logger.error('[softphone] client destroy failed', err);
			}
		}
		if (this.#state !== STATES.IDLE) this.#setState(STATES.IDLE);
	}

	async answer(callId) {
		const cli = this.#cli;
		if (!cli)
			return {
				ok: false,
				error: {
					code: 'not_connected',
				},
			};
		const call = cli.callById(callId);
		if (!call)
			return {
				ok: false,
				error: {
					code: 'call_not_found',
				},
			};
		// guards against double answer: server-side autoAnswer already answered
		// on this client, or a previous command is still in flight
		if (call.answeredAt !== 0)
			return {
				ok: true,
			};
		if (this.#answersInFlight.has(callId))
			return {
				ok: true,
			};

		this.#answersInFlight.add(callId);
		try {
			// the answer command can outrun the SIP INVITE; wait for the native
			// session to appear before answering
			const deadline = Date.now() + ANSWER_SIP_RETRY_TIMEOUT;
			while (!call.sip && Date.now() < deadline) {
				await sleep(ANSWER_SIP_RETRY_INTERVAL);
			}
			if (!call.sip) {
				return {
					ok: false,
					error: {
						code: 'no_sip_session',
					},
				};
			}
			await call.answer({
				useAudio: true,
			});
			return {
				ok: true,
			};
		} catch (err) {
			logger.error('[softphone] answer failed', err);
			return {
				ok: false,
				error: {
					code: 'answer_failed',
					message: err.message,
				},
			};
		} finally {
			this.#answersInFlight.delete(callId);
		}
	}

	async call(destination, params = {}) {
		const cli = this.#cli;
		if (!cli)
			return {
				ok: false,
				error: {
					code: 'not_connected',
				},
			};
		try {
			await cli.call({
				destination,
				params,
			});
			return {
				ok: true,
			};
		} catch (err) {
			logger.error('[softphone] call failed', err);
			return {
				ok: false,
				error: {
					code: 'call_failed',
					message: err.message,
				},
			};
		}
	}

	async hangup(callId) {
		const cli = this.#cli;
		if (!cli)
			return {
				ok: false,
				error: {
					code: 'not_connected',
				},
			};
		const call = cli.callById(callId);
		if (!call)
			return {
				ok: false,
				error: {
					code: 'call_not_found',
				},
			};
		try {
			await call.hangup();
			return {
				ok: true,
			};
		} catch (err) {
			logger.error('[softphone] hangup failed', err);
			return {
				ok: false,
				error: {
					code: 'hangup_failed',
					message: err.message,
				},
			};
		}
	}

	activeCalls() {
		if (!this.#cli) return [];
		return this.#cli
			.allCall()
			.filter((call) => call.answeredAt !== 0 && call.hangupAt === 0);
	}

	async destroy() {
		this.#clearReconnect();
		await this.#teardown();
	}
}

module.exports = {
	Softphone,
	STATES,
};
