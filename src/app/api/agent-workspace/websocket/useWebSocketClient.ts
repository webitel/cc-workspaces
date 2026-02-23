import { eventBus } from '@webitel/ui-sdk/scripts';
import { markRaw, reactive, readonly, ref, shallowReactive } from 'vue';
import { Client } from 'webitel-sdk';
import { WebSocketClientEvent } from '../../../../ui/enums/WebSocketClientEvent.enum';
import { WebSocketConnectionState } from '../../../../ui/enums/WebSocketConnectionState.enum';
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
	[WebSocketClientEvent.AfterAuth]: EventCallback<Client>;
	[WebSocketClientEvent.Error]: EventCallback<unknown>;
};

let client: Client | null = null;
const state = ref<WebSocketConnectionState>(WebSocketConnectionState.Idle);

let clientInitPromise: Promise<Client> | null = null;
let reconnectAttemptCount = 0;
let reconnectTimerId: number | null = null;
let clientGenerationCount = 0;

const listeners: { [K in keyof EventMap]: EventMap[K][] } = {
	[WebSocketClientEvent.AfterAuth]: [],
	[WebSocketClientEvent.Error]: [
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
		const configStr = localStorage.getItem('CONFIG');
		return configStr ? (JSON.parse(configStr).CLI ?? {}) : {};
	} catch {
		return {};
	}
}

function attachCoreHandlers(cli: Client, generation: number) {
	cli.on('error', (e) => {
		if (generation !== clientGenerationCount) return;
		emit(WebSocketClientEvent.Error, e);
	});

	cli.on('disconnected', () => {
		if (generation !== clientGenerationCount) return;
		handleDisconnect();
	});

	cli.on('show_message', (e: any) => {
		if (generation !== clientGenerationCount) return;
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
	const generation = ++clientGenerationCount;
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

	emit(WebSocketClientEvent.AfterAuth, cli);
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
		state.value = WebSocketConnectionState.Disconnected;
		(window as any).cli = null;
	}
}

function scheduleReconnect() {
	if (reconnectTimerId || reconnectAttemptCount >= MAX_RECONNECT_ATTEMPTS)
		return;

	const delay = Math.min(
		1000 * 2 ** reconnectAttemptCount,
		MAX_RECONNECT_DELAY,
	);
	reconnectAttemptCount++;

	reconnectTimerId = window.setTimeout(async () => {
		reconnectTimerId = null;
		try {
			await getCliInstance({
				forceReconnect: true,
			});
			reconnectAttemptCount = 0;
		} catch {
			scheduleReconnect();
		}
	}, delay);
}

async function handleDisconnect() {
	if (state.value === WebSocketConnectionState.Reconnecting) return;

	state.value = WebSocketConnectionState.Reconnecting;
	await destroyClient();
	scheduleReconnect();
}

async function getCliInstance({
	forceReconnect = false,
}: {
	forceReconnect?: boolean;
} = {}): Promise<Client> {
	if (
		!forceReconnect &&
		client &&
		state.value === WebSocketConnectionState.Connected
	) {
		return client;
	}

	if (clientInitPromise) return clientInitPromise;

	state.value = client
		? WebSocketConnectionState.Reconnecting
		: WebSocketConnectionState.Connecting;

	clientInitPromise = (async () => {
		try {
			const cli = await createClient();
			client = cli;
			state.value = WebSocketConnectionState.Connected;
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
