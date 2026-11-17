/**
 * Debug recorder ("black box") — spike.
 *
 * Imported first in main.ts so it is evaluated before webitel-sdk and JsSIP.
 * Does nothing unless enabled with `?debug=1` (kept in localStorage until
 * `?debug=0` or `webitelDebug.disable()`).
 *
 * Archive: Ctrl+Alt+Shift+D, or `webitelDebug.download()` in the console.
 */
import { installConsoleCollector, originalConsole } from './collectors/console';
import { installDeviceCollector } from './collectors/devices';
import { collectEnvironment } from './collectors/environment';
import { installErrorCollector } from './collectors/errors';
import { installHttpCollector } from './collectors/http';
import { installLifecycleCollector } from './collectors/lifecycle';
import { installWebRtcCollector } from './collectors/webrtc';
import { installWebSocketCollector } from './collectors/websocket';
import { resolveEnabled, setEnabled } from './config';
import { downloadArchive } from './export';
import { RecorderSink } from './sink';
import type { RecorderStats, RecordFn } from './types';

const PREFIX = '[debug-recorder]';

let sink: RecorderSink | null = null;
let recording = false;

// the store survives being disabled, so an archive can still be taken afterwards
function getSink(): RecorderSink {
	sink ??= new RecorderSink();
	return sink;
}

export interface WebitelDebugApi {
	readonly recording: boolean;
	enable(): void;
	disable(): void;
	download(): Promise<void>;
	stats(): Promise<RecorderStats>;
	clear(): Promise<void>;
}

declare global {
	interface Window {
		webitelDebug?: WebitelDebugApi;
	}
}

async function download(): Promise<void> {
	const s = getSink();
	const records = await s.dump();
	await downloadArchive(records, recording ? s.sid : null);
	originalConsole.info(PREFIX, `archive with ${records.length} records saved`);
}

function startRecording(): void {
	const s = getSink();
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
			() => installLifecycleCollector(record, () => s.markCleanExit()),
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
	recording = true;

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
	originalConsole.info(
		PREFIX,
		'recording. Archive: Ctrl+Alt+Shift+D or webitelDebug.download(). Stop: webitelDebug.disable()',
	);
}

window.webitelDebug = {
	get recording() {
		return recording;
	},
	enable() {
		setEnabled(true);
		originalConsole.info(PREFIX, 'enabled, reload the page to start recording');
	},
	disable() {
		setEnabled(false);
		originalConsole.info(
			PREFIX,
			'disabled from the next reload; recorded data is kept until clear()',
		);
	},
	download,
	stats: () => getSink().stats(),
	clear: () => getSink().clear(),
};

if (resolveEnabled()) {
	try {
		startRecording();
	} catch (err) {
		originalConsole.error(PREFIX, 'failed to start', err);
	}
}
