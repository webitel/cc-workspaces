import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRecorderCore } from '../recorder-core';
import type { RecorderStorage } from '../storage';
import type { RecorderEvent, StoredRecord } from '../types';

function memoryStorage(meta: Record<string, unknown> = {}) {
	const records: StoredRecord[] = [];
	const storage: RecorderStorage = {
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
		getMeta: async <T>(key: string) => meta[key] as T,
		setMeta: async (key, value) => {
			meta[key] = value;
		},
		close: () => {},
	};
	const events = () => records.map((r) => JSON.parse(r.json) as RecorderEvent);
	return {
		storage,
		meta,
		events,
	};
}

const init = (sid: string, cleanExitSid: string | null = null) => ({
	kind: 'init' as const,
	sid,
	t: Date.now(),
	cleanExitSid,
});

describe('recorder core', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(1_000_000);
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it('writes a stall record while the main thread is silent, and closes it on the next heartbeat', async () => {
		const { storage, meta, events } = memoryStorage();
		const core = createRecorderCore(storage);
		await core.handle(init('s1'));
		await core.handle({
			kind: 'hb',
			t: Date.now(),
		});

		vi.advanceTimersByTime(5_000);
		await core.checkStall();
		expect(events().map((e) => e.type)).toEqual([
			'main-thread-stall-start',
		]);
		// persisted right away: survives a reload of the frozen page
		expect(meta['session:s1']).toMatchObject({
			stallSince: 1_000_000,
		});

		await core.handle({
			kind: 'hb',
			t: Date.now(),
		});
		expect(events().at(-1)).toMatchObject({
			type: 'main-thread-stall-end',
			data: {
				durationMs: 5_000,
			},
		});
		expect(meta['session:s1']).toMatchObject({
			stallSince: null,
		});
	});

	it('does not report a stall while the tab is hidden', async () => {
		const { storage, events } = memoryStorage();
		const core = createRecorderCore(storage);
		await core.handle(init('s1'));
		await core.handle({
			kind: 'hb',
			t: Date.now(),
		});
		await core.handle({
			kind: 'visibility',
			hidden: true,
		});
		vi.advanceTimersByTime(60_000);
		await core.checkStall();
		expect(events()).toEqual([]);
	});

	it('reports how the previous page-load ended: frozen, not clean', async () => {
		const { storage, events } = memoryStorage({
			lastSid: 'old',
			'session:old': {
				lastHeartbeat: 999_000,
				stallSince: 998_000,
			},
		});
		const core = createRecorderCore(storage);
		await core.handle(init('new'));
		expect(events()).toEqual([
			expect.objectContaining({
				sid: 'new',
				ch: 'recorder',
				type: 'previous-session',
				data: {
					sid: 'old',
					lastHeartbeat: 999_000,
					stallSince: 998_000,
					cleanExit: false,
				},
			}),
		]);
	});

	it('marks the previous page-load clean only when its own sid reached pagehide', async () => {
		const { storage, events } = memoryStorage({
			lastSid: 'old',
		});
		await createRecorderCore(storage).handle(init('new', 'old'));
		expect(events()[0].data).toMatchObject({
			cleanExit: true,
		});

		const other = memoryStorage({
			lastSid: 'old',
		});
		await createRecorderCore(other.storage).handle(init('new', 'older'));
		expect(other.events()[0].data).toMatchObject({
			cleanExit: false,
		});
	});
});
