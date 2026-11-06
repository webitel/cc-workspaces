import { eventBus } from '@webitel/ui-sdk/scripts';

import { WebSocketConnectionState } from '../../ui/enums/WebSocketConnectionState.enum';
import { instance } from '../api/instance';

// tmp debug [WTEL-10935]: що відбувається з чатом на постобробці
// під час роботи нічого не друкує, тільки збирає; вивід — pp.report() / pp.snap()
// знести разом з викликом у main.ts

const STYLE = 'color:#b36; font-weight:600';

// вивід у консоль дорогий, тому все, що збирається, обмежене
const MAX_EVENTS = 300;
const MAX_SNAPSHOTS = 8;
const MAX_ROWS = 40;

const WATCHED_ACTIONS = new Set([
	'features/chat/OPEN_CHAT',
	'features/chat/SET_WORKSPACE',
	'features/chat/RESET_WORKSPACE',
	'features/chat/RESET_CHAT',
	'features/chat/HANDLE_CLOSE_ACTION',
	'features/chat/HANDLE_DESTROY_ACTION',
	'features/chat/active/RELOAD_CHAT_LIST',
	'features/chat/closed/OPEN_CLOSED_CHAT',
	'features/chat/closed/LOAD_CLOSED_CHAT',
	'features/chat/closed/LOAD_CLOSED_CHAT_HISTORY',
	'features/chat/closed/unprocessed/LOAD_UNPROCESSED_CHATS',
	'features/chat/chatHistory/LOAD_CHAT_HISTORY',
	'features/chat/chatHistory/LOAD_PAGE',
]);

const timeline = [];
const snapshots = [];

const short = (id) =>
	typeof id === 'string' && id.length > 10 ? `${id.slice(0, 8)}…` : (id ?? '—');

const push = (kind, what, extra = '') => {
	if (timeline.length >= MAX_EVENTS) timeline.shift();

	timeline.push({
		time: new Date().toLocaleTimeString('uk-UA', {
			hour12: false,
		}),
		kind,
		what: String(what),
		extra: String(extra).slice(0, 140),
	});
};

const describePayload = (payload) => {
	if (!payload || typeof payload !== 'object') return String(payload ?? '');
	if (payload.task) return describePayload(payload.task);

	return [
		payload.id && `id ${short(payload.id)}`,
		payload.conversationId && `conv ${short(payload.conversationId)}`,
		payload.channelId && `ch ${short(payload.channelId)}`,
		payload.contactId && `contact ${payload.contactId}`,
	]
		.filter(Boolean)
		.join(' ');
};

// все, що потрібно, щоб обрати дискримінатор постобробки
const chatRow = (chat, key) => ({
	key: short(key),
	'.id': short(chat.id),
	conversationId: short(chat.conversationId),
	channelId: short(chat.channelId),
	inviteId: short(chat.inviteId),
	state: chat.state,
	closedAt: chat.closedAt || 0,
	closeReason: chat.closeReason ?? '—',
	hasReporting: chat.hasReporting,
	allowReporting: chat.allowReporting,
	hasTask: !!chat.task,
	'task.channel': chat.task?.channel ?? '—',
	'task.hasReporting': chat.task?.hasReporting ?? '—',
	missingMsg: !!chat.hasMissingMessages,
	'contact.id': chat.contact?.id ?? null,
	msgs: chat.messages?.length ?? 0,
	// живий інстанс sdk чи плоский спред без прототипу
	live: typeof chat.leave === 'function',
	previewAs: chat.closedAt && chat.closeReason ? 'Closed' : 'Active',
});

const collect = (label) => {
	const store = window.$store;
	const wsState = store?.state?.client?.state;
	const client = store?.state?.client?.getClientSync?.();

	if (!client) {
		return {
			label,
			empty: `клієнта ще нема, socket = ${wsState}`,
		};
	}

	const all = [
		...client.conversationStore.entries(),
	];
	// закриті цікаві завжди, решту ріжемо — console.table на сотнях рядків вішає вкладку
	const picked =
		all.length > MAX_ROWS ? all.filter(([, chat]) => chat.closedAt) : all;

	const onWorkspace = store.getters['workspace/TASK_ON_WORKSPACE'];

	return {
		label,
		total: all.length,
		rows: picked.slice(0, MAX_ROWS).map(([key, chat]) => chatRow(chat, key)),
		lists: {
			socket: wsState,
			visible:
				store.state.features.chat.active.visibleChatIds.map(short).join(' ') ||
				'—',
			postProcessing:
				store.getters['features/chat/postProcessing/CHATS_IN_POSTPROCESSING']
					.map((chat) => short(chat.conversationId))
					.join(' ') || '—',
			unprocessed:
				store.state.features.chat.closed.unprocessed.chatsList
					.map((chat) => short(chat.id))
					.join(' ') || '—',
			'workspace.id': onWorkspace ? String(onWorkspace.id) : '—',
			'workspace.conv': onWorkspace ? short(onWorkspace.conversationId) : '—',
			'workspace.live': onWorkspace
				? typeof onWorkspace.leave === 'function'
				: '—',
			'workspace.contact.id': onWorkspace?.contact?.id ?? null,
		},
	};
};

const printSnapshot = (snapshot) => {
	if (snapshot.empty) {
		console.log(
			`%c[pp] snapshot "${snapshot.label}": ${snapshot.empty}`,
			STYLE,
		);
		return;
	}

	console.group(
		`%c[pp] snapshot "${snapshot.label}" — conversationStore: ${snapshot.total}`,
		STYLE,
	);
	console.table(snapshot.rows);
	console.table([
		snapshot.lists,
	]);
	console.groupEnd();
};

// тихий зліпок: лягає в пам'ять, друкується тільки в pp.report()
const capture = (label) => {
	try {
		if (snapshots.length >= MAX_SNAPSHOTS) snapshots.shift();
		snapshots.push(collect(label));
		push('snapshot', label);
	} catch (err) {
		push('snapshot FAILED', label, err?.message || err);
	}
};

const snap = (label = 'вручну') => {
	try {
		const snapshot = collect(label);
		if (snapshots.length >= MAX_SNAPSHOTS) snapshots.shift();
		snapshots.push(snapshot);
		push('snapshot', label);
		printSnapshot(snapshot);
	} catch (err) {
		console.log(`%c[pp] snapshot "${label}" впав`, STYLE, err);
	}
};

const report = () => {
	console.group(`%c[pp] звіт — ${timeline.length} подій`, STYLE);
	snapshots.forEach(printSnapshot);
	console.table(timeline);
	console.groupEnd();
};

const reset = () => {
	timeline.length = 0;
	snapshots.length = 0;
};

export const installChatPostProcessingDebug = () => {
	const store = window.$store;

	eventBus.$on('notification', ({ type, text } = {}) => {
		if (type !== 'error') return;
		push('toast', text);
	});

	instance.interceptors.response.use(
		(response) => response,
		(error) => {
			const { config, response } = error || {};

			push(
				'request',
				`${config?.method?.toUpperCase?.() || '?'} ${config?.url || '?'}`,
				`${response?.status} ${response?.data?.id || ''} ${response?.data?.detail || ''}`,
			);

			return Promise.reject(error);
		},
	);

	store.subscribeAction({
		before: ({ type, payload }) => {
			if (!WATCHED_ACTIONS.has(type)) return;
			push('action', type, describePayload(payload));
		},
		error: ({ type }, _state, error) => {
			if (!WATCHED_ACTIONS.has(type)) return;
			push('action FAILED', type, error?.message || error);
		},
	});

	// головне питання: що в сторі одразу після F5. тихо, без друку
	const unwatch = store.watch(
		(state) => state.client.state,
		(wsState) => {
			if (wsState !== WebSocketConnectionState.Connected) return;
			unwatch();
			capture('socket Connected');
			setTimeout(() => capture('+5с після конекту'), 5000);
		},
	);

	window.pp = {
		snap,
		report,
		reset,
		timeline,
		snapshots,
	};

	console.log(
		'%c[pp] увімкнено, мовчки. pp.snap("мітка") — зліпок, pp.report() — усе зібране',
		STYLE,
	);
};
