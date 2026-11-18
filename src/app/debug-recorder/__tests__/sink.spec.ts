import { afterEach, describe, expect, it, vi } from 'vitest';
import type { RecorderStorage } from '../storage';
import type { StoredRecord } from '../types';

const records: StoredRecord[] = [];
vi.mock('../storage', () => ({
	openStorage: async (): Promise<RecorderStorage> => ({
		append: async (batch) => {
			records.push(...batch);
		},
		readAll: async () => records,
		clear: async () => {
			records.length = 0;
		},
		stats: async () => ({
			records: records.length,
			chars: 0,
			firstT: null,
			lastT: null,
			byChannel: {},
		}),
		getMeta: async () => undefined,
		setMeta: async () => {},
		close: () => {},
	}),
}));

const { RecorderSink } = await import('../sink');

type Behaviour = 'fails-to-load' | 'ready-but-silent';

function fakeWorker(behaviour: Behaviour) {
	return class FakeWorker {
		onmessage: ((event: { data: unknown }) => void) | null = null;
		onerror: ((event: { preventDefault(): void }) => void) | null = null;
		terminated = false;
		constructor() {
			setTimeout(() => {
				if (behaviour === 'fails-to-load') {
					this.onerror?.({
						preventDefault() {},
					});
				} else {
					this.onmessage?.({
						data: {
							reqId: 0,
						},
					});
				}
			}, 0);
		}
		postMessage() {}
		terminate() {
			this.terminated = true;
		}
	};
}

describe('RecorderSink', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.useRealTimers();
		records.length = 0;
	});

	it('replays everything to the inline store when the worker fails to load', async () => {
		vi.stubGlobal('Worker', fakeWorker('fails-to-load'));
		const sink = new RecorderSink();
		sink.record('console', 'log', {
			args: [
				'before the worker failed',
			],
		});
		sink.flush();
		await new Promise((r) => setTimeout(r, 10));
		sink.record('console', 'log', {
			args: [
				'after',
			],
		});

		const dumped = await sink.dump();
		expect(sink.usesWorker).toBe(false);
		expect(dumped.map((r) => JSON.parse(r.json).data.args[0])).toEqual([
			'before the worker failed',
			'after',
		]);
	});

	it('destroy() resolves quickly even if a loaded worker never answers', async () => {
		vi.useFakeTimers();
		vi.stubGlobal('Worker', fakeWorker('ready-but-silent'));
		const sink = new RecorderSink();
		await vi.advanceTimersByTimeAsync(0);

		let done = false;
		void sink.destroy().then(() => {
			done = true;
		});
		await vi.advanceTimersByTimeAsync(2_500);
		expect(done).toBe(true);
	});

	it('rejects dump() after the timeout instead of hanging', async () => {
		vi.useFakeTimers();
		vi.stubGlobal('Worker', fakeWorker('ready-but-silent'));
		const sink = new RecorderSink();
		await vi.advanceTimersByTimeAsync(0);

		const result = sink.dump().then(
			() => 'resolved',
			(err: Error) => err.message,
		);
		await vi.advanceTimersByTimeAsync(31_000);
		expect(await result).toMatch(/timed out/);
	});
});
