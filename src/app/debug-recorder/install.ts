// Debug recorder, opt-in via ?debug=1 (24h TTL); first import in main.ts so it wraps APIs before webitel-sdk/JsSIP load
import { installConsoleCollector, originalConsole } from './collectors/console';
import { installDeviceCollector } from './collectors/devices';
import { collectEnvironment } from './collectors/environment';
import { installErrorCollector } from './collectors/errors';
import { installHttpCollector } from './collectors/http';
import { installLifecycleCollector } from './collectors/lifecycle';
import { installWebRtcCollector } from './collectors/webrtc';
import { installWebSocketCollector } from './collectors/websocket';
import {
	CLEAN_EXIT_STORAGE_KEY,
	DB_NAME,
	HAS_DATA_STORAGE_KEY,
	resolveEnabled,
	setEnabled,
} from './config';
import { downloadArchive } from './export';
import { RecorderSink } from './sink';
import type { RecorderStats, RecordFn } from './types';

const PREFIX = '[debug-recorder]';

let sink: RecorderSink | null = null;
let indicator: HTMLElement | null = null;

export interface WebitelDebugApi {
	readonly recording: boolean;
	enable(): void;
	disable(): Promise<void>;
	download(): Promise<void>;
	stats(): Promise<RecorderStats | null>;
}

declare global {
	interface Window {
		webitelDebug?: WebitelDebugApi;
	}
}

function safeLocalStorage(action: (storage: Storage) => void): void {
	try {
		action(localStorage);
	} catch {
		// storage blocked: nothing to persist or clean
	}
}

async function download(): Promise<void> {
	if (!sink) {
		originalConsole.info(PREFIX, 'not recording, nothing to download');
		return;
	}
	const records = await sink.dump();
	await downloadArchive(records, sink.sid);
	originalConsole.info(PREFIX, `archive with ${records.length} records saved`);
}

function showIndicator(): void {
	const el = document.createElement('button');
	el.type = 'button';
	el.textContent = '● REC';
	el.title =
		'Debug recording is on. Click (or Ctrl+Alt+Shift+D) to download the archive for support.';
	el.setAttribute('aria-label', el.title);
	Object.assign(el.style, {
		position: 'fixed',
		left: '8px',
		bottom: '8px',
		zIndex: '2147483647',
		padding: '2px 8px',
		font: '600 11px/16px system-ui, sans-serif',
		color: '#fff',
		background: '#d32f2f',
		border: '0',
		borderRadius: '10px',
		opacity: '0.85',
		cursor: 'pointer',
	});
	el.addEventListener('click', () => void download());
	indicator = el;
	const mount = () => document.body.appendChild(el);
	if (document.body) mount();
	else
		document.addEventListener('DOMContentLoaded', mount, {
			once: true,
		});
}

// stops recording and deletes the store; called on logout because workstations are shared
export async function wipeDebugRecorder(): Promise<void> {
	let hadData = false;
	safeLocalStorage((s) => {
		hadData = s.getItem(HAS_DATA_STORAGE_KEY) !== null;
		setEnabled(false);
		s.removeItem(HAS_DATA_STORAGE_KEY);
		s.removeItem(CLEAN_EXIT_STORAGE_KEY);
	});
	indicator?.remove();
	indicator = null;
	const current = sink;
	sink = null;
	// destroy() never rejects and is time-bounded, so logout cannot hang on it
	if (current) await current.destroy();
	if (current || hadData) {
		try {
			indexedDB.deleteDatabase(DB_NAME);
		} catch {
			// IndexedDB unavailable: nothing was stored either
		}
	}
}

function startRecording(): void {
	const s = new RecorderSink();
	sink = s;
	safeLocalStorage((storage) => storage.setItem(HAS_DATA_STORAGE_KEY, '1'));
	const record: RecordFn = (ch, type, data) => s.record(ch, type, data);

	const steps: [
		string,
		() => void,
	][] = [
		[
			'console',
			() => installConsoleCollector(record),
		],
		[
			'errors',
			() => installErrorCollector(record, window),
		],
		[
			'http',
			() => installHttpCollector(record, window),
		],
		[
			'websocket',
			() => installWebSocketCollector(record, window),
		],
		[
			'webrtc',
			() => installWebRtcCollector(record, window),
		],
		[
			'devices',
			() => installDeviceCollector(record),
		],
		[
			'environment',
			() => collectEnvironment(record),
		],
		[
			'lifecycle',
			() =>
				installLifecycleCollector(record, {
					onExit: () => s.markCleanExit(),
					onResume: () => s.markResumed(),
				}),
		],
	];
	const failed: string[] = [];
	for (const [name, install] of steps) {
		try {
			install();
		} catch (err) {
			failed.push(name);
			originalConsole.warn(PREFIX, `collector "${name}" failed`, err);
		}
	}
	s.startHeartbeat();
	record('recorder', 'start', {
		worker: s.usesWorker,
		failedCollectors: failed,
	});

	window.addEventListener('keydown', (event) => {
		if (
			event.ctrlKey &&
			event.altKey &&
			event.shiftKey &&
			event.code === 'KeyD'
		) {
			event.preventDefault();
			void download();
		}
	});
	showIndicator();
	originalConsole.info(
		PREFIX,
		'recording. Archive: REC badge, Ctrl+Alt+Shift+D or webitelDebug.download(). Stop and wipe: webitelDebug.disable()',
	);
}

window.webitelDebug = {
	get recording() {
		return sink !== null;
	},
	enable() {
		setEnabled(true);
		originalConsole.info(PREFIX, 'enabled, reload the page to start recording');
	},
	async disable() {
		await wipeDebugRecorder();
		originalConsole.info(PREFIX, 'stopped, recorded data deleted');
	},
	download,
	stats: async () => (sink ? sink.stats() : null),
};

if (resolveEnabled()) {
	try {
		startRecording();
	} catch (err) {
		originalConsole.error(PREFIX, 'failed to start', err);
	}
} else {
	// flag expired or switched off since the last recording: drop what is left
	safeLocalStorage((storage) => {
		if (!storage.getItem(HAS_DATA_STORAGE_KEY)) return;
		storage.removeItem(HAS_DATA_STORAGE_KEY);
		indexedDB.deleteDatabase(DB_NAME);
	});
}
