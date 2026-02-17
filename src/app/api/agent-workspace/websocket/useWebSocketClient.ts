import { ref, reactive, shallowReactive, markRaw, readonly } from 'vue';
import { eventBus } from '@webitel/ui-sdk/scripts';
import { Client } from 'webitel-sdk';

import { WebSocketClientEvent } from '../../../types/WebSocketClientEvent';
import { WebSocketConnectionState } from '../../../types/WebSocketConnectionState';
import websocketErrorEventHandler from './websocketErrorEventHandler';
/* ============================================================================
 * Constants
 * ========================================================================== */

const MAX_RECONNECT_ATTEMPTS = 10;
const MAX_RECONNECT_DELAY = 15000;

/* ============================================================================
 * Singleton state
 * ========================================================================== */

type EventCallback<T = unknown> = (payload: T) => void;

type EventMap = {
	[WebSocketClientEvent.AFTER_AUTH]: EventCallback<Client>;
	[WebSocketClientEvent.ERROR]: EventCallback<unknown>;
};

let client: Client | null = null;
const state = ref<keyof typeof WebSocketConnectionState>(
	WebSocketConnectionState.IDLE,
);

let clientInitPromise: Promise<Client> | null = null;
let reconnectAttempt = 0;
let reconnectTimer: number | null = null;
let clientGeneration = 0;

const listeners: { [K in keyof EventMap]: EventMap[K][] } = {
	[WebSocketClientEvent.AFTER_AUTH]: [],
	[WebSocketClientEvent.ERROR]: [
		websocketErrorEventHandler,
	],
};

/* ============================================================================
 * Environment
 * ========================================================================== */

const { hostname, protocol } = window.location;
const origin = `${protocol}//${hostname}`.replace(/^http/, 'ws');

const endpoint =
	import.meta.env.MODE === 'production'
		? `${origin}/ws`
		: import.meta.env.VITE_WEB_SOCKET_URL;

/* ============================================================================
 * Helpers
 * ========================================================================== */

function emit<K extends keyof EventMap>(
	event: K,
	payload: Parameters<EventMap[K]>[0],
) {
	listeners[event].forEach((cb) => cb(payload));
}

function getCliConfig(): Record<string, any> {
	try {
		const raw = localStorage.getItem('CONFIG');
		return raw ? (JSON.parse(raw).CLI ?? {}) : {};
	} catch {
		return {};
	}
}

function attachCoreHandlers(cli: Client, generation: number) {
	cli.on('error', (e) => {
		if (generation !== clientGeneration) return;
		emit(WebSocketClientEvent.ERROR, e);
	});

	cli.on('disconnected', () => {
		if (generation !== clientGeneration) return;
		handleDisconnect();
	});

	cli.on('show_message', (e: any) => {
		if (generation !== clientGeneration) return;
		eventBus.$emit('notification', {
			type: e.type,
			text: e.message,
			timeout: e.timeout,
		});
	});

	cli.on('open_link', (e: any) => {
		const url = e.url.startsWith('https://') ? e.url : `https://${e.url}`;
		window.open(url, '_blank');
	});
}

/**
 * Mark the asynchronously created phone UA instance as raw.
 *
 * The phone instance is created after auth, so we wait for it to appear
 * (or for the `phone_connected` event) and then wrap `cli.phone.ua` in
 * `markRaw` to prevent Vue from making it reactive.
 */
async function markAsyncPhoneRaw(cli: Client) {
	/*
    cli.phone.ua contains "configuration" property, which has no setter so cannot be wrapped with reactivity.
    so that, reactivity breaks
     for more info, see WTEL-4236
     */
	return new Promise<void>((resolve) => {
		const timeout = window.setTimeout(resolve, 5000);

		const markUa = () => {
			if (!cli.phone?.ua) return;
			cli.phone.ua = markRaw(cli.phone.ua);
			clearTimeout(timeout);
			resolve();
		};

		cli.phone?.ua ? markUa() : cli.on('phone_connected', markUa);
	});
}

/* ============================================================================
 * Lifecycle
 * ========================================================================== */

async function createClient(): Promise<Client> {
	const generation = ++clientGeneration;
	const token = localStorage.getItem('access-token');
	const cliConfig = getCliConfig();

	// why reactive? https://github.com/vuejs/core/discussions/7811#discussioncomment-5181921
	// const cli = new Client(config);
	const cli = shallowReactive(
		new Client({
			endpoint,
			token,
			registerWebDevice: cliConfig.registerWebDevice ?? true,
			debug: cliConfig.debug,
		}),
	);

	// why reactive? https://github.com/vuejs/core/discussions/7811#discussioncomment-5181921
	cli.conversationStore = reactive(cli.conversationStore);
	cli.callStore = reactive(cli.callStore);

	attachCoreHandlers(cli, generation);

	await cli.connect();
	await cli.auth();

	emit(WebSocketClientEvent.AFTER_AUTH, cli);
	await markAsyncPhoneRaw(cli);

	(window as any).cli = cli;
	return cli;
}

async function destroyClient() {
	if (!client) return;

	try {
		await client.destroy?.();
	} catch (e) {
		console.warn('[WS] destroy error', e);
	} finally {
		client = null;
		state.value = WebSocketConnectionState.DISCONNECTED;
		(window as any).cli = null;
	}
}

function scheduleReconnect() {
	if (reconnectTimer || reconnectAttempt >= MAX_RECONNECT_ATTEMPTS) return;

	const delay = Math.min(1000 * 2 ** reconnectAttempt, MAX_RECONNECT_DELAY);
	reconnectAttempt++;

	reconnectTimer = window.setTimeout(async () => {
		reconnectTimer = null;
		try {
			await getCliInstance({
				forceReconnnect: true,
			});
			reconnectAttempt = 0;
		} catch {
			scheduleReconnect();
		}
	}, delay);
}

async function handleDisconnect() {
	if (state.value === WebSocketConnectionState.RECONNECTING) return;

	state.value = WebSocketConnectionState.RECONNECTING;
	await destroyClient();
	scheduleReconnect();
	console.log('[WS] reconnected');
}

async function getCliInstance({
	forceReconnnect = false,
}: {
	forceReconnnect?: boolean;
} = {}): Promise<Client> {
	if (
		!forceReconnnect &&
		client &&
		state.value === WebSocketConnectionState.CONNECTED
	) {
		return client;
	}

	if (clientInitPromise) return clientInitPromise;

	state.value = client
		? WebSocketConnectionState.RECONNECTING
		: WebSocketConnectionState.CONNECTING;

	clientInitPromise = (async () => {
		try {
			const cli = await createClient();
			client = cli;
			state.value = WebSocketConnectionState.CONNECTED;
			return cli;
		} finally {
			clientInitPromise = null;
		}
	})();

	return clientInitPromise;
}

/* ============================================================================
 * Public API
 * ========================================================================== */

export function useWebSocketClient() {
	function on<K extends keyof EventMap>(
		event: K,
		cb: EventMap[K] | EventMap[K][],
	) {
		Array.isArray(cb)
			? listeners[event].push(...cb)
			: listeners[event].push(cb);
	}

	return {
		client,
		state: readonly(state),

		getCliInstance,
		destroyClient,

		on,
		Event: WebSocketClientEvent,
	};
}
