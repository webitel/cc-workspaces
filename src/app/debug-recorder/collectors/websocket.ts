import { redactText, redactUrl, sanitize, truncate } from '../sanitize';
import type { RecordFn } from '../types';

const TAPPED = Symbol.for('wt-debug-recorder.tapped');
const IGNORED_PROTOCOLS = [
	'vite-hmr',
];

type Channel = 'ws' | 'sip';

function protocolsOf(protocols?: string | string[]): string[] {
	if (!protocols) return [];
	return Array.isArray(protocols)
		? protocols
		: [
				protocols,
			];
}

const decoder = new TextDecoder();

function toText(data: unknown): string | null {
	if (typeof data === 'string') return data;
	if (data instanceof ArrayBuffer) return decoder.decode(data);
	if (ArrayBuffer.isView(data)) return decoder.decode(data);
	return null;
}

/** first line + Call-ID/CSeq: enough to filter a SIP trace without reading bodies */
export function sipSummary(text: string) {
	const firstLine = text.slice(0, text.indexOf('\r\n') >>> 0).trim();
	const header = (name: string, compact: string) =>
		new RegExp(`^(?:${name}|${compact})[ \\t]*:[ \\t]*(.+)$`, 'im')
			.exec(text)?.[1]
			?.trim();
	return {
		line: redactText(firstLine, {
			phones: true,
		}),
		callId: header('Call-ID', 'i'),
		cseq: header('CSeq', 'CSeq'),
	};
}

function describePayload(data: unknown, ch: Channel) {
	const text = toText(data);
	if (text === null) {
		return {
			binary:
				typeof Blob !== 'undefined' && data instanceof Blob
					? data.size
					: String(data),
		};
	}
	if (ch === 'sip') {
		// JsSIP keep-alive is a bare CRLF
		if (!text.trim())
			return {
				keepAlive: true,
			};
		return {
			...sipSummary(text),
			text: truncate(
				redactText(text, {
					phones: true,
				}),
			),
		};
	}
	try {
		return {
			msg: sanitize(JSON.parse(text)),
		};
	} catch {
		return {
			text: truncate(redactText(text)),
		};
	}
}

// global WebSocket subclass: records lifecycle and frames of both the webitel-sdk and the JsSIP (`sip`) sockets
export function installWebSocketCollector(
	record: RecordFn,
	target: {
		WebSocket: typeof WebSocket;
	},
): void {
	const Native = target.WebSocket;
	if (!Native || (Native as unknown as Record<symbol, boolean>)[TAPPED]) return;
	let nextId = 0;

	class RecordedWebSocket extends Native {
		static [TAPPED] = true;
		#id = 0;
		#ch: Channel | null = null;

		constructor(url: string | URL, protocols?: string | string[]) {
			super(url, protocols);
			const list = protocolsOf(protocols);
			if (list.some((p) => IGNORED_PROTOCOLS.includes(p))) return;

			const id = ++nextId;
			const ch: Channel = list.includes('sip') ? 'sip' : 'ws';
			this.#id = id;
			this.#ch = ch;

			record(ch, 'ws:create', {
				id,
				url: redactUrl(String(url)),
				protocols: list,
			});
			this.addEventListener('open', () =>
				record(ch, 'ws:open', {
					id,
					protocol: this.protocol,
				}),
			);
			this.addEventListener('message', (event) =>
				record(ch, 'ws:in', {
					id,
					...describePayload(event.data, ch),
				}),
			);
			this.addEventListener('error', () =>
				record(ch, 'ws:error', {
					id,
				}),
			);
			this.addEventListener('close', (event) =>
				record(ch, 'ws:close', {
					id,
					code: event.code,
					reason: event.reason,
					wasClean: event.wasClean,
				}),
			);
		}

		send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
			if (this.#ch) {
				record(this.#ch, 'ws:out', {
					id: this.#id,
					...describePayload(data, this.#ch),
				});
			}
			super.send(data);
		}
	}

	target.WebSocket = RecordedWebSocket;
}
