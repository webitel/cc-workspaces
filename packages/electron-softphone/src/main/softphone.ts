import { EventEmitter } from 'node:events';
import { app } from 'electron';
import type { SipRegisterConfig } from 'electron-sip';
import type { Call, SipClient } from 'webitel-sdk';
import { Client } from 'webitel-sdk';
import type { SoftphoneAppConfig } from './config';
import * as logger from './logger';
import type { CommandError } from './protocol';
import { PROTOCOL_VERSION } from './protocol';
import SipAdapter from './sip-adapter';

export const STATES = {
	IDLE: 'idle', // waiting for a workspace hello
	CONNECTING: 'connecting', // SDK socket connect + auth
	REGISTERING: 'registering', // SIP REGISTER in flight
	REGISTERED: 'registered',
	ERROR: 'error',
} as const;

export type SoftphoneStateName = (typeof STATES)[keyof typeof STATES];

export interface SoftphoneStateSnapshot {
	state: SoftphoneStateName;
	sdkConnected: boolean;
	sipRegistered: boolean;
	extension: string | null;
	appVersion: string;
	protocolVersion: number;
	platform: NodeJS.Platform;
	lastError: string | null;
}

export interface CommandResult {
	ok: boolean;
	error?: CommandError;
}

interface HelloPayload {
	token: string;
	endpoint: string;
}

interface SoftphoneEvents {
	state: [
		state: SoftphoneStateSnapshot,
	];
	'calls-changed': [
		calls: Call[],
	];
}

const RECONNECT_BASE_DELAY = 1000;
const MAX_RECONNECT_DELAY = 15000;
const ANSWER_SIP_RETRY_INTERVAL = 150;
const ANSWER_SIP_RETRY_TIMEOUT = 2000;
const SETUP_STEP_TIMEOUT = 15000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In the Electron main process the global WebSocket fires `onerror` but never
// `onclose` when the endpoint is unreachable, and the SDK's Socket only wires
// `onclose` — so cli.connect() can stay pending forever. Every setup step is
// therefore raced against a timeout so the reconnect loop keeps working.
const withTimeout = <T>(promise: Promise<T>, label: string): Promise<T> =>
	new Promise<T>((resolve, reject) => {
		const timer = setTimeout(
			() => reject(new Error(`${label} timed out`)),
			SETUP_STEP_TIMEOUT,
		);
		promise.then(
			(value) => {
				clearTimeout(timer);
				resolve(value);
			},
			(err) => {
				clearTimeout(timer);
				reject(err);
			},
		);
	});

// Owns the webitel-sdk Client (own socket, control plane) and the native SIP
// adapter (media plane). Web workspaces deliver credentials via `hello` and
// drive answer/call; everything else (agent session, hold, transfer, ...)
// stays on the web app's own socket.
export class Softphone extends EventEmitter<SoftphoneEvents> {
	#config: SoftphoneAppConfig;
	#cli: Client | null = null;
	#adapter: SipAdapter | null = null;
	#token: string | null = null;
	#endpoint: string | null = null;
	#state: SoftphoneStateName = STATES.IDLE;
	#lastError: string | null = null;
	#reconnectTimer: NodeJS.Timeout | null = null;
	#reconnectAttempts = 0;
	#generation = 0;
	#answersInFlight = new Set<string>();
	// serializes teardown/start cycles: restart(), the reconnect timer and
	// destroy() all funnel through this chain, so two #start() calls can never
	// interleave and clobber #cli/#adapter
	#lifecycleChain: Promise<unknown> = Promise.resolve();
	#destroyed = false;

	constructor(config: SoftphoneAppConfig) {
		super();
		this.#config = config;
	}

	#enqueueLifecycle(fn: () => Promise<void>): Promise<unknown> {
		this.#lifecycleChain = this.#lifecycleChain.then(fn, fn);
		return this.#lifecycleChain;
	}

	getState(): SoftphoneStateSnapshot {
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

	#setState(state: SoftphoneStateName, lastError: string | null = null): void {
		this.#state = state;
		this.#lastError = lastError;
		this.emit('state', this.getState());
	}

	// `hello {token, endpoint}` from a web client. Reconnect only when the
	// credentials actually changed or nothing is running yet.
	async handleHello({ token, endpoint }: HelloPayload): Promise<void> {
		const sameSession =
			this.#cli && this.#token === token && this.#endpoint === endpoint;
		this.#token = token;
		this.#endpoint = endpoint;
		if (sameSession) return;
		await this.restart();
	}

	// token refresh: kept in memory only, used on the next (re)connect
	updateToken(token: string): void {
		this.#token = token;
	}

	async restart(): Promise<void> {
		this.#clearReconnect();
		this.#reconnectAttempts = 0;
		await this.#enqueueLifecycle(async () => {
			await this.#teardown();
			await this.#start();
		});
	}

	// the last workspace connection is gone: unregister SIP and close the SDK
	// socket so calls stop being routed to an unattended device. Credentials
	// stay in memory; the next hello brings the session back up.
	async suspend(): Promise<void> {
		this.#clearReconnect();
		await this.#enqueueLifecycle(() => this.#teardown());
	}

	async #start(): Promise<void> {
		if (this.#destroyed || !this.#token || !this.#endpoint) return;
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
			// the SDK routes runtime failures (e.g. Call.answer swallows the
			// rejection and still returns true) through handleError → 'error';
			// without a listener they would vanish silently
			cli.on('error', (err) => {
				if (generation !== this.#generation) return;
				logger.error('[softphone] sdk error', err);
			});

			await withTimeout(cli.connect(), 'connect');
			await withTimeout(cli.auth(), 'auth');

			const adapter = new SipAdapter({
				debug: this.#config.debug,
			});
			this.#adapter = adapter;
			adapter.on('registered', () => {
				if (generation !== this.#generation) return;
				// pjsip may have recovered on its own — cancel a pending restart
				this.#clearReconnect();
				this.#setState(STATES.REGISTERED);
			});
			adapter.on('unregistered', () => {
				if (generation !== this.#generation) return;
				if (this.#state === STATES.REGISTERED) {
					// lost an established registration; pjsip retries by itself,
					// the reconnect is a fallback if it never comes back
					this.#setState(STATES.REGISTERING);
					this.#scheduleReconnect();
				} else if (this.#state === STATES.REGISTERING) {
					// the addon resolves register() when the account is created,
					// not when the registrar responds — an initial REGISTER
					// failure surfaces as this early 'unregistered' event
					this.#setState(STATES.ERROR, 'register_failed');
					this.#scheduleReconnect();
				}
			});

			// manual registerCallClient(): the SDK helper passes only the raw
			// user_default_device response to register(), while pjsip also needs
			// register_sec/codecs/nat from local config. The phone must be
			// attached BEFORE subscribeCall so the snapshot's Call objects get
			// their sip sessions from the constructor. The cast is deliberate:
			// the SDK types register() against the webrtc-shaped
			// SipConfiguration while the 'sip' device uses another field set.
			cli.phone = adapter as unknown as SipClient;
			cli.subscribePhone(adapter as unknown as SipClient);
			// populates cli.callStore so cli.answer()/hangup() can find calls;
			// ringing events after this point also honor server-side autoAnswer
			await withTimeout(
				cli.subscribeCall(() => this.emit('calls-changed', cli.allCall())),
				'subscribeCall',
			);
			this.#setState(STATES.REGISTERING);
			const device = (await withTimeout(
				cli.deviceConfig('sip'),
				'deviceConfig',
			)) as unknown as SipRegisterConfig;
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

	#errorCode(err: unknown): string {
		const message = (err as Error)?.message || String(err);
		if (/device|not found/i.test(message)) return 'register_failed';
		if (/auth|token|401/i.test(message)) return 'auth_failed';
		return message;
	}

	#scheduleReconnect(): void {
		this.#clearReconnect();
		const delay = Math.min(
			RECONNECT_BASE_DELAY * 2 ** this.#reconnectAttempts,
			MAX_RECONNECT_DELAY,
		);
		this.#reconnectAttempts += 1;
		logger.log(`[softphone] reconnect in ${delay}ms`);
		this.#reconnectTimer = setTimeout(() => {
			this.#enqueueLifecycle(async () => {
				await this.#teardown();
				await this.#start();
			});
		}, delay);
	}

	#clearReconnect(): void {
		if (this.#reconnectTimer) clearTimeout(this.#reconnectTimer);
		this.#reconnectTimer = null;
	}

	async #teardown(): Promise<void> {
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
				cli.phone = undefined;
				await cli.destroy();
			} catch (err) {
				logger.error('[softphone] client destroy failed', err);
			}
		}
		if (this.#state !== STATES.IDLE) this.#setState(STATES.IDLE);
	}

	async answer(callId: string): Promise<CommandResult> {
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
			// note: the SDK resolves true once the answer was handed to the
			// phone even if SIP later fails — those failures surface via the
			// client 'error' listener. false means the guard (sip/phone) failed.
			const accepted = await call.answer({
				audio: true,
			});
			if (!accepted) {
				return {
					ok: false,
					error: {
						code: 'answer_rejected',
					},
				};
			}
			return {
				ok: true,
			};
		} catch (err) {
			logger.error('[softphone] answer failed', err);
			return {
				ok: false,
				error: {
					code: 'answer_failed',
					message: (err as Error).message,
				},
			};
		} finally {
			this.#answersInFlight.delete(callId);
		}
	}

	async call(destination: string, params: object = {}): Promise<CommandResult> {
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
					message: (err as Error).message,
				},
			};
		}
	}

	async hangup(callId: string): Promise<CommandResult> {
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
					message: (err as Error).message,
				},
			};
		}
	}

	activeCalls(): Call[] {
		if (!this.#cli) return [];
		return this.#cli
			.allCall()
			.filter((call) => call.answeredAt !== 0 && call.hangupAt === 0);
	}

	async destroy(): Promise<void> {
		this.#destroyed = true;
		this.#clearReconnect();
		await this.#enqueueLifecycle(() => this.#teardown());
	}
}
