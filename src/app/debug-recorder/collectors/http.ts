import { redactText, redactUrl, sanitize, truncate } from '../sanitize';
import type { RecordFn } from '../types';

const ERROR_BODY_CHARS = 4_096;

function errorBody(text: string): unknown {
	try {
		return sanitize(JSON.parse(text), {
			maxText: ERROR_BODY_CHARS,
		});
	} catch {
		return truncate(redactText(text), ERROR_BODY_CHARS);
	}
}

function urlOf(input: RequestInfo | URL): string {
	if (typeof input === 'string') return input;
	if (input instanceof URL) return input.href;
	return input.url;
}

/**
 * Method, URL, status and duration of every request. Bodies are not recorded,
 * except the response body of a failed request (sanitized and cut).
 */
export function installHttpCollector(
	record: RecordFn,
	target: {
		fetch: typeof fetch;
		XMLHttpRequest: typeof XMLHttpRequest;
	},
): void {
	let nextId = 0;

	const nativeFetch = target.fetch;
	if (nativeFetch) {
		target.fetch = async function (
			this: unknown,
			input: RequestInfo | URL,
			init?: RequestInit,
		) {
			const id = ++nextId;
			const started = performance.now();
			const method = (
				init?.method ||
				(typeof Request !== 'undefined' && input instanceof Request
					? input.method
					: 'GET')
			).toUpperCase();
			const url = redactUrl(urlOf(input));
			record('http', 'fetch:start', {
				id,
				method,
				url,
			});
			try {
				const res = await nativeFetch.call(this, input, init);
				const base = {
					id,
					method,
					url,
					status: res.status,
					durationMs: Math.round(performance.now() - started),
				};
				if (res.ok) {
					record('http', 'fetch:end', base);
				} else {
					res
						.clone()
						.text()
						.then(
							(text) =>
								record('http', 'fetch:end', {
									...base,
									body: errorBody(text),
								}),
							() => record('http', 'fetch:end', base),
						);
				}
				return res;
			} catch (err) {
				record('http', 'fetch:fail', {
					id,
					method,
					url,
					durationMs: Math.round(performance.now() - started),
					error: sanitize(err),
				});
				throw err;
			}
		} as typeof fetch;
	}

	const XHR = target.XMLHttpRequest;
	if (!XHR) return;
	const meta = new WeakMap<
		XMLHttpRequest,
		{
			method: string;
			url: string;
		}
	>();
	const nativeOpen = XHR.prototype.open;
	const nativeSend = XHR.prototype.send;

	XHR.prototype.open = function (
		this: XMLHttpRequest,
		method: string,
		url: string | URL,
		...rest: unknown[]
	) {
		meta.set(this, {
			method: String(method).toUpperCase(),
			url: redactUrl(String(url)),
		});
		return (nativeOpen as (...args: unknown[]) => void).call(
			this,
			method,
			url,
			...rest,
		);
	} as typeof XHR.prototype.open;

	XHR.prototype.send = function (
		this: XMLHttpRequest,
		body?: Document | XMLHttpRequestBodyInit | null,
	) {
		const info = meta.get(this);
		if (info) {
			const id = ++nextId;
			const started = performance.now();
			record('http', 'xhr:start', {
				id,
				...info,
			});
			this.addEventListener('loadend', () => {
				const failed = this.status === 0 || this.status >= 400;
				let body: unknown;
				if (failed && this.status !== 0) {
					try {
						body =
							this.responseType === '' || this.responseType === 'text'
								? errorBody(this.responseText)
								: this.responseType === 'json'
									? sanitize(this.response, {
											maxText: ERROR_BODY_CHARS,
										})
									: `[${this.responseType}]`;
					} catch {
						body = undefined;
					}
				}
				record('http', 'xhr:end', {
					id,
					...info,
					status: this.status,
					durationMs: Math.round(performance.now() - started),
					networkError: this.status === 0 ? true : undefined,
					body,
				});
			});
		}
		return nativeSend.call(this, body);
	};
}
