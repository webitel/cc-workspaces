import { describe, expect, it, vi } from 'vitest';
import { installHttpCollector } from '../collectors/http';
import { installWebRtcCollector } from '../collectors/webrtc';
import { installWebSocketCollector } from '../collectors/websocket';
import { REDACTED } from '../sanitize';
import type { RecordFn } from '../types';

class FakeWebSocket extends EventTarget {
	static OPEN = 1;
	sent: unknown[] = [];
	protocol = '';
	constructor(
		public url: string | URL,
		public protocols?: string | string[],
	) {
		super();
	}
	send(data: unknown) {
		this.sent.push(data);
	}
	receive(data: unknown) {
		this.dispatchEvent(
			new MessageEvent('message', {
				data,
			}),
		);
	}
}

function setupWs() {
	const record = vi.fn<RecordFn>();
	const target = {
		WebSocket: FakeWebSocket as unknown as typeof WebSocket,
	};
	installWebSocketCollector(record, target);
	return {
		record,
		WS: target.WebSocket as unknown as typeof FakeWebSocket,
	};
}

describe('websocket collector', () => {
	it('records SIP frames on the sip channel with credentials removed', () => {
		const { record, WS } = setupWs();
		const ws = new WS('wss://pbx.webitel.me/sip', 'sip');
		const invite =
			'INVITE sip:380671234567@webitel.me SIP/2.0\r\nCall-ID: abc\r\nCSeq: 2 INVITE\r\nProxy-Authorization: Digest response="secret"\r\n\r\n';
		ws.send(invite);

		expect(ws.sent).toEqual([
			invite,
		]);
		const [ch, type, data] = record.mock.calls[record.mock.calls.length - 1];
		expect(ch).toBe('sip');
		expect(type).toBe('ws:out');
		expect(data).toMatchObject({
			line: 'INVITE sip:***567@webitel.me SIP/2.0',
			callId: 'abc',
			cseq: '2 INVITE',
		});
		expect(
			(
				data as {
					text: string;
				}
			).text,
		).not.toContain('secret');
	});

	it('records incoming webitel JSON frames sanitized, keeps instanceof working', () => {
		const { record, WS } = setupWs();
		const ws = new WS('wss://x.webitel.me/ws/websocket?access_token=t');
		ws.receive(
			JSON.stringify({
				event: 'call_ringing',
				data: {
					from_number: '380671234567',
					token: 't',
				},
			}),
		);

		expect(ws).toBeInstanceOf(FakeWebSocket);
		expect(record.mock.calls[0]).toEqual([
			'ws',
			'ws:create',
			{
				id: 1,
				url: `wss://x.webitel.me/ws/websocket?access_token=${REDACTED}`,
				protocols: [],
			},
		]);
		expect(record.mock.calls.at(-1)).toEqual([
			'ws',
			'ws:in',
			{
				id: 1,
				msg: {
					event: 'call_ringing',
					data: {
						from_number: '***567',
						token: REDACTED,
					},
				},
			},
		]);
	});

	it('ignores the vite HMR socket and does not wrap twice', () => {
		const { record, WS } = setupWs();
		new WS('ws://localhost:5173', 'vite-hmr');
		expect(record).not.toHaveBeenCalled();

		const target = {
			WebSocket: WS as unknown as typeof WebSocket,
		};
		installWebSocketCollector(record, target);
		expect(target.WebSocket).toBe(WS);
	});
});

describe('http collector', () => {
	it('records a failed fetch with a sanitized error body and passes the response through', async () => {
		const record = vi.fn<RecordFn>();
		const response = new Response(
			JSON.stringify({
				message: 'bad',
				token: 'leak',
			}),
			{
				status: 401,
			},
		);
		const target = {
			fetch: vi.fn(async () => response) as unknown as typeof fetch,
			XMLHttpRequest: undefined as unknown as typeof XMLHttpRequest,
		};
		installHttpCollector(record, target);

		const res = await target.fetch('/api/user?accessToken=abc', {
			method: 'post',
		});
		expect(res).toBe(response);
		await vi.waitFor(() => expect(record).toHaveBeenCalledTimes(2));

		expect(record.mock.calls[0]).toEqual([
			'http',
			'fetch:start',
			{
				id: 1,
				method: 'POST',
				url: `/api/user?accessToken=${REDACTED}`,
			},
		]);
		const [, type, data] = record.mock.calls[1];
		expect(type).toBe('fetch:end');
		expect(data).toMatchObject({
			status: 401,
			body: {
				message: 'bad',
				token: REDACTED,
			},
		});
	});

	it('records a network failure and rethrows it', async () => {
		const record = vi.fn<RecordFn>();
		const target = {
			fetch: vi.fn(async () => {
				throw new TypeError('Failed to fetch');
			}) as unknown as typeof fetch,
			XMLHttpRequest: undefined as unknown as typeof XMLHttpRequest,
		};
		installHttpCollector(record, target);

		await expect(target.fetch('/api/x')).rejects.toThrow('Failed to fetch');
		expect(record.mock.calls.at(-1)?.[1]).toBe('fetch:fail');
	});
});

class FakeXhr extends EventTarget {
	status = 0;
	responseType = '';
	responseText = '';
	open(_method: string, _url: string) {}
	send() {}
	finish(status: number) {
		this.status = status;
		this.dispatchEvent(new Event('loadend'));
	}
}

describe('xhr collector', () => {
	it('records one end per request when an XHR is reused', () => {
		const record = vi.fn<RecordFn>();
		installHttpCollector(record, {
			fetch: undefined as unknown as typeof fetch,
			XMLHttpRequest: FakeXhr as unknown as typeof XMLHttpRequest,
		});
		const xhr = new FakeXhr();
		xhr.open('GET', '/a');
		xhr.send();
		xhr.finish(200);
		xhr.open('POST', '/b');
		xhr.send();
		xhr.finish(204);

		const ends = record.mock.calls.filter(([, type]) => type === 'xhr:end');
		expect(ends.map(([, , data]) => data)).toEqual([
			expect.objectContaining({
				id: 1,
				method: 'GET',
				url: '/a',
				status: 200,
			}),
			expect.objectContaining({
				id: 2,
				method: 'POST',
				url: '/b',
				status: 204,
			}),
		]);
	});
});

class FakePeerConnection extends EventTarget {
	connectionState = 'new';
	signalingState = 'stable';
	iceConnectionState = 'new';
	iceGatheringState = 'new';
	getStats = vi.fn(async () => new Map());
	setState(state: string) {
		this.connectionState = state;
		this.dispatchEvent(new Event('connectionstatechange'));
	}
}

describe('webrtc collector', () => {
	it('stops polling a failed connection after one last snapshot, resumes on reconnect', async () => {
		vi.useFakeTimers();
		try {
			const record = vi.fn<RecordFn>();
			const target = {
				RTCPeerConnection:
					FakePeerConnection as unknown as typeof RTCPeerConnection,
			};
			installWebRtcCollector(record, target);
			const pc =
				new target.RTCPeerConnection() as unknown as FakePeerConnection;
			const statsCount = () =>
				record.mock.calls.filter(([, type]) => type === 'pc:stats').length;

			await vi.advanceTimersByTimeAsync(10_000);
			expect(statsCount()).toBe(2);

			pc.setState('failed');
			await vi.advanceTimersByTimeAsync(0);
			expect(statsCount()).toBe(3);
			await vi.advanceTimersByTimeAsync(60_000);
			expect(statsCount()).toBe(3);

			pc.setState('connected');
			await vi.advanceTimersByTimeAsync(5_000);
			expect(statsCount()).toBe(4);
		} finally {
			vi.useRealTimers();
		}
	});
});
