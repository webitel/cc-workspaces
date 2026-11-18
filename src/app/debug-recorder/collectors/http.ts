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

// method, URL, status, duration; a body only for failed responses (sanitized and cut)
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
	// per request: open() sets method/url, send() sets id/started; one loadend listener per XHR
	const meta = new WeakMap<
		XMLHttpRequest,
		{
			method: string;
			url: string;
			id: number;
			started: number;
		}
	>();
	const listening = new WeakSet<XMLHttpRequest>();

	const onLoadEnd = function (this: XMLHttpRequest) {
		const info = meta.get(this);
		if (!info?.id) return;
		const { method, url, id, started } = info;
		info.id = 0;
		let body: unknown;
		if (this.status >= 400) {
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
			method,
			url,
			status: this.status,
			durationMs: Math.round(performance.now() - started),
			networkError: this.status === 0 ? true : undefined,
			body,
		});
	};
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
			id: 0,
			started: 0,
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
			info.id = ++nextId;
			info.started = performance.now();
			record('http', 'xhr:start', {
				id: info.id,
				method: info.method,
				url: info.url,
			});
			if (!listening.has(this)) {
				listening.add(this);
				this.addEventListener('loadend', onLoadEnd);
			}
		}
		return nativeSend.call(this, body);
	};
}
