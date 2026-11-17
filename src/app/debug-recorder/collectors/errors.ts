import { redactUrl, sanitize } from '../sanitize';
import type { RecordFn } from '../types';

export function installErrorCollector(record: RecordFn, target: Window): void {
	// capture phase: resource load errors (<script>, <link>, <img>) do not bubble
	target.addEventListener(
		'error',
		(event) => {
			const el = event.target as HTMLElement | null;
			if (el && el !== (target as unknown) && 'tagName' in el) {
				record('error', 'resource', {
					tag: el.tagName.toLowerCase(),
					url: redactUrl(
						(el as HTMLScriptElement).src || (el as HTMLLinkElement).href || '',
					),
				});
				return;
			}
			const e = event as ErrorEvent;
			record('error', 'uncaught', {
				message: sanitize(e.message),
				source: e.filename ? redactUrl(e.filename) : undefined,
				line: e.lineno,
				column: e.colno,
				error: sanitize(e.error),
			});
		},
		true,
	);

	target.addEventListener('unhandledrejection', (event) => {
		record('error', 'unhandledrejection', {
			reason: sanitize(event.reason),
		});
	});

	target.addEventListener('securitypolicyviolation', (event) => {
		record('error', 'csp', {
			directive: event.violatedDirective,
			blocked: redactUrl(event.blockedURI),
			source: event.sourceFile ? redactUrl(event.sourceFile) : undefined,
			line: event.lineNumber,
		});
	});

	// failed dynamic import / chunk load after a deploy
	target.addEventListener('vite:preloadError', (event) => {
		record('error', 'vite-preload', {
			error: sanitize(
				(
					event as Event & {
						payload?: unknown;
					}
				).payload,
			),
		});
	});
}
