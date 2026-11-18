import { sanitize } from '../sanitize';
import type { RecordFn } from '../types';

const LEVELS = [
	'debug',
	'log',
	'info',
	'warn',
	'error',
] as const;

type Level = (typeof LEVELS)[number];

/** console untouched by the recorder: use it for the recorder's own messages */
export const originalConsole: Pick<Console, Level> = {
	debug: console.debug.bind(console),
	log: console.log.bind(console),
	info: console.info.bind(console),
	warn: console.warn.bind(console),
	error: console.error.bind(console),
};

// must run before JsSIP loads: its Logger binds console.info once, at module load
export function installConsoleCollector(record: RecordFn): void {
	let inside = false;
	for (const level of LEVELS) {
		const native = console[level];
		console[level] = function (...args: unknown[]) {
			if (!inside) {
				inside = true;
				try {
					record('console', level, {
						args: args.map((arg) => sanitize(arg)),
					});
				} catch {
					// never break the app because of the recorder
				} finally {
					inside = false;
				}
			}
			return native.apply(this, args);
		};
	}
}
