import { LONG_FRAME_THRESHOLD_MS } from '../config';
import { redactUrl } from '../sanitize';
import type { RecordFn } from '../types';

interface LoafScript {
	sourceURL?: string;
	sourceFunctionName?: string;
	invoker?: string;
	duration: number;
}

/** online/offline, visibility, freeze/resume, unload, and long main-thread frames */
export function installLifecycleCollector(
	record: RecordFn,
	hooks: {
		onExit: () => void;
		onResume: () => void;
	},
): void {
	window.addEventListener('online', () => record('lifecycle', 'online'));
	window.addEventListener('offline', () => record('lifecycle', 'offline'));
	document.addEventListener('visibilitychange', () =>
		record('lifecycle', 'visibility', {
			state: document.visibilityState,
		}),
	);
	document.addEventListener('freeze', () => record('lifecycle', 'freeze'));
	document.addEventListener('resume', () => record('lifecycle', 'resume'));
	window.addEventListener('pageshow', (event) => {
		record('lifecycle', 'pageshow', {
			persisted: event.persisted,
		});
		if (event.persisted) hooks.onResume();
	});
	window.addEventListener('pagehide', (event) => {
		record('lifecycle', 'pagehide', {
			persisted: event.persisted,
		});
		hooks.onExit();
	});

	const supported =
		typeof PerformanceObserver !== 'undefined'
			? PerformanceObserver.supportedEntryTypes
			: [];
	const type = supported.includes('long-animation-frame')
		? 'long-animation-frame'
		: supported.includes('longtask')
			? 'longtask'
			: null;
	if (!type) return;

	new PerformanceObserver((list) => {
		for (const entry of list.getEntries()) {
			if (entry.duration < LONG_FRAME_THRESHOLD_MS) continue;
			const scripts = (
				(
					entry as PerformanceEntry & {
						scripts?: LoafScript[];
					}
				).scripts ?? []
			)
				.sort((a, b) => b.duration - a.duration)
				.slice(0, 3)
				.map((s) => ({
					source: s.sourceURL ? redactUrl(s.sourceURL) : undefined,
					fn: s.sourceFunctionName,
					invoker: s.invoker,
					durationMs: Math.round(s.duration),
				}));
			record('perf', type, {
				durationMs: Math.round(entry.duration),
				blockingMs: Math.round(
					(
						entry as PerformanceEntry & {
							blockingDuration?: number;
						}
					).blockingDuration ?? 0,
				),
				scripts: scripts.length ? scripts : undefined,
			});
		}
	}).observe({
		type,
		buffered: true,
	});
}
