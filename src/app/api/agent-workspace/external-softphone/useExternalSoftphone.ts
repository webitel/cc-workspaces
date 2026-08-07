import { eventBus } from '@webitel/ui-sdk/scripts';
import type { CallSession, Client } from 'webitel-sdk';
import { endpoint } from '../websocket/endpoint';
import { getExternalSoftphoneConfig } from './config';
import { RemotePhone } from './RemotePhone';

const PROTOCOL_VERSION = 1;
const RECONNECT_BASE_DELAY = 1000;
const MAX_RECONNECT_DELAY = 15000;
// connection refused on loopback settles in milliseconds; the timeout only
// guards pathological cases (filtered port, Safari blocking the attempt)
const PROBE_TIMEOUT = 1500;

interface SoftphoneState {
	state?: string;
	sdkConnected?: boolean;
	sipRegistered?: boolean;
	extension?: string | null;
	appVersion?: string;
	protocolVersion?: number;
	lastError?: string | null;
}

/* ============================================================================
 * Singleton state
 * ========================================================================== */

let ws: WebSocket | null = null;
let started = false;
let active = false;
let seq = 0;
let reconnectAttempts = 0;
let reconnectTimerId: number | null = null;
let currentCli: Client | null = null;
let currentPhone: RemotePhone | null = null;
let lastState: SoftphoneState | null = null;
// socket opened by probe(), adopted by the next start() so the utility does
// not see a connect/disconnect flap between detection and use
let pendingSocket: WebSocket | null = null;

/**
 * Whether the current client generation runs in external-softphone mode.
 * Runtime state, not config: in auto mode only a successful probe makes it
 * true. Used by call-store gates (mic bypass, audio-only).
 */
export function isExternalPhoneActive(): boolean {
	return active;
}

function send(type: string, payload: Record<string, unknown> = {}) {
	if (!ws || ws.readyState !== WebSocket.OPEN) return;
	seq += 1;
	ws.send(
		JSON.stringify({
			v: PROTOCOL_VERSION,
			seq,
			type,
			...payload,
		}),
	);
}

function sendHello() {
	send('hello', {
		token: localStorage.getItem('access-token'),
		endpoint,
		protocolVersion: PROTOCOL_VERSION,
	});
}

function findCallIdBySession(session: CallSession): string | null {
	if (!currentCli) return null;
	const call = currentCli
		.allCall()
		.find((candidate) => candidate.sip === session);
	return call ? call.id : null;
}

/* ============================================================================
 * Phone attach / detach
 * ========================================================================== */

function attach() {
	const cli = currentCli;
	if (!cli || !ws || ws.readyState !== WebSocket.OPEN) return;
	if (currentPhone && cli.phone === currentPhone) return;
	// never displace a foreign phone (e.g. the webrtc SipPhone of a client
	// generation that was created without external mode)
	if (cli.phone && !(cli.phone instanceof RemotePhone)) return;

	// a fresh RemotePhone per attach: subscribePhone() adds listeners on the
	// phone, so reusing one instance across client generations would keep
	// feeding events into destroyed clients
	const phone = new RemotePhone(send, findCallIdBySession);
	currentPhone = phone;
	cli.phone = phone;
	cli.subscribePhone(phone);
	patchExistingCalls(cli, phone);
	if (lastState?.sipRegistered) phone.setRegistered(true);
}

/**
 * Calls that rang while the utility (or this tab) was disconnected got
 * `sip = null` in the Call constructor and could never be answered; give
 * every un-answered call a remote stub session.
 */
function patchExistingCalls(cli: Client, phone: RemotePhone) {
	cli.allCall().forEach((call) => {
		if (!call.sip && call.answeredAt === 0) {
			call.setSip(phone.sipSessionByCallId(call.id));
		}
	});
}

function detach() {
	lastState = null;
	if (currentPhone) {
		// emits `unregistered` → phone_registered=false → isPhoneReg store flag
		currentPhone.setRegistered(false);
	}
	if (currentCli && currentPhone && currentCli.phone === currentPhone) {
		currentCli.phone = null;
	}
	currentPhone = null;
}

/* ============================================================================
 * Local WebSocket connection
 * ========================================================================== */

function handleMessage(raw: string) {
	let message: {
		type?: string;
		ok?: boolean;
		error?: {
			code?: string;
			message?: string;
		};
	} & SoftphoneState;
	try {
		message = JSON.parse(raw);
	} catch {
		return;
	}

	switch (message.type) {
		case 'state': {
			lastState = message;
			if (message.sipRegistered) {
				attach();
				currentPhone?.setRegistered(true);
			} else {
				currentPhone?.setRegistered(false);
			}
			break;
		}
		case 'ack': {
			if (!message.ok) {
				console.warn('[external-softphone] command failed', message.error);
				eventBus.$emit('notification', {
					type: 'error',
					text: `Softphone: ${message.error?.code || 'command failed'}`,
				});
			}
			break;
		}
		default:
			break;
	}
}

function wireSocket(socket: WebSocket) {
	ws = socket;
	socket.onmessage = (event) => handleMessage(event.data);
	socket.onclose = () => {
		ws = null;
		detach();
		scheduleReconnect();
	};
	socket.onerror = () => {
		// onclose follows and drives the retry
	};
}

function connect() {
	const { port } = getExternalSoftphoneConfig();
	let socket: WebSocket;
	try {
		socket = new WebSocket(`ws://127.0.0.1:${port}`);
	} catch {
		scheduleReconnect();
		return;
	}

	wireSocket(socket);
	socket.onopen = () => {
		reconnectAttempts = 0;
		sendHello();
	};
}

function scheduleReconnect() {
	if (reconnectTimerId) return;
	const delay = Math.min(
		RECONNECT_BASE_DELAY * 2 ** reconnectAttempts,
		MAX_RECONNECT_DELAY,
	);
	// the utility may simply not be running yet — keep probing forever
	reconnectAttempts += 1;
	reconnectTimerId = window.setTimeout(() => {
		reconnectTimerId = null;
		connect();
	}, delay);
}

/* ============================================================================
 * Public API
 * ========================================================================== */

export function useExternalSoftphone() {
	/**
	 * Detect a running utility: open a socket to the loopback port and keep it
	 * for the next start() on success. Resolves false on refusal, timeout, or
	 * a blocked attempt (e.g. Safari mixed content) — the caller then falls
	 * back to the web phone.
	 */
	function probe(): Promise<boolean> {
		if (pendingSocket && pendingSocket.readyState === WebSocket.OPEN) {
			return Promise.resolve(true);
		}
		if (ws && ws.readyState === WebSocket.OPEN) {
			// manager already connected (reconnect of the web client)
			return Promise.resolve(true);
		}
		const { port } = getExternalSoftphoneConfig();
		return new Promise((resolve) => {
			let settled = false;
			let socket: WebSocket;
			const settle = (ok: boolean) => {
				if (settled) return;
				settled = true;
				window.clearTimeout(timer);
				resolve(ok);
			};
			const timer = window.setTimeout(() => {
				try {
					socket.close();
				} catch {
					// closing a CONNECTING socket may throw in some browsers
				}
				settle(false);
			}, PROBE_TIMEOUT);
			try {
				socket = new WebSocket(`ws://127.0.0.1:${port}`);
			} catch {
				settle(false);
				return;
			}
			socket.onerror = () => settle(false);
			socket.onclose = () => {
				if (pendingSocket === socket) pendingSocket = null;
				settle(false);
			};
			socket.onopen = () => {
				pendingSocket = socket;
				settle(true);
			};
		});
	}

	/**
	 * Call after every successful cli.auth() (each client generation): stores
	 * the live client, re-hands the (possibly refreshed) token to the utility
	 * and re-attaches the phone.
	 */
	function start(cli: Client) {
		currentCli = cli;
		active = true;
		if (!started) {
			started = true;
			if (pendingSocket && pendingSocket.readyState === WebSocket.OPEN) {
				// adopt the probe socket instead of reconnecting
				const socket = pendingSocket;
				pendingSocket = null;
				wireSocket(socket);
				sendHello();
			} else {
				pendingSocket = null;
				connect();
			}
			return;
		}
		if (ws && ws.readyState === WebSocket.OPEN) {
			// hello is idempotent on the utility side (same token+endpoint is a
			// no-op) and doubles as the token re-handoff
			sendHello();
			attach();
		}
	}

	/**
	 * Forget the current SDK client without touching the utility connection.
	 * Must be called when the web client is destroyed (disconnect/logout) so a
	 * later `state` message can't re-attach the phone onto a dead client.
	 */
	function clearClient() {
		if (currentCli && currentPhone && currentCli.phone === currentPhone) {
			currentCli.phone = null;
		}
		currentPhone = null;
		currentCli = null;
	}

	function stop() {
		detach();
		currentCli = null;
		active = false;
		if (reconnectTimerId) {
			window.clearTimeout(reconnectTimerId);
			reconnectTimerId = null;
		}
		if (pendingSocket) {
			pendingSocket.onclose = null;
			pendingSocket.close();
			pendingSocket = null;
		}
		if (ws) {
			ws.onclose = null;
			ws.close();
			ws = null;
		}
		started = false;
	}

	return {
		probe,
		start,
		stop,
		clearClient,
		getLastState: () => lastState,
	};
}
