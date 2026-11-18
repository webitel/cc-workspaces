import { STALL_THRESHOLD_MS } from './config';
import type { RecorderStorage } from './storage';
import type { StoredRecord, WorkerRequest, WorkerResponse } from './types';

interface SessionMeta {
	lastHeartbeat?: number;
	stallSince?: number | null;
}

// per-session keys: a dying page's worker may still write after the next page started
const sessionKey = (sid: string) => `session:${sid}`;

// storage-side logic shared by the worker and the inline fallback
export function createRecorderCore(storage: RecorderStorage) {
	let sid = '';
	let lastHbAt = 0;
	let lastHbPersistedAt = 0;
	let hidden = false;
	let stallSince: number | null = null;

	const internal = (type: string, data: unknown): StoredRecord => {
		const t = Date.now();
		const json = JSON.stringify({
			t,
			sid,
			ch: 'recorder',
			type,
			data,
		});
		return {
			t,
			ch: 'recorder',
			sid,
			type,
			n: json.length,
			json,
		};
	};

	const saveSession = () =>
		storage.setMeta(sessionKey(sid), {
			lastHeartbeat: lastHbAt || undefined,
			stallSince,
		} satisfies SessionMeta);

	// runs on the storage side, so it fires while the main thread is frozen
	const checkStall = async () => {
		if (!sid || !lastHbAt || hidden || stallSince !== null) return;
		const gap = Date.now() - lastHbAt;
		if (gap < STALL_THRESHOLD_MS) return;
		stallSince = lastHbAt;
		await saveSession();
		await storage.append([
			internal('main-thread-stall-start', {
				lastHeartbeat: lastHbAt,
				gapMs: gap,
			}),
		]);
	};

	const handle = async (
		msg: WorkerRequest,
	): Promise<WorkerResponse | undefined> => {
		switch (msg.kind) {
			case 'init': {
				sid = msg.sid;
				const previousSid = await storage.getMeta<string>('lastSid');
				if (previousSid) {
					const previous = await storage.getMeta<SessionMeta>(
						sessionKey(previousSid),
					);
					await storage.append([
						internal('previous-session', {
							sid: previousSid,
							lastHeartbeat: previous?.lastHeartbeat,
							// set only if the page was still frozen when it died
							stallSince: previous?.stallSince ?? null,
							cleanExit: msg.cleanExitSid === previousSid,
						}),
					]);
					await storage.setMeta(sessionKey(previousSid), undefined);
				}
				await storage.setMeta('lastSid', sid);
				await saveSession();
				return undefined;
			}
			case 'events':
				await storage.append(msg.events);
				return undefined;
			case 'hb': {
				lastHbAt = Date.now();
				if (stallSince !== null) {
					const durationMs = msg.t - stallSince;
					stallSince = null;
					await storage.append([
						internal('main-thread-stall-end', {
							durationMs,
						}),
					]);
					await saveSession();
					lastHbPersistedAt = lastHbAt;
				} else if (lastHbAt - lastHbPersistedAt > 5_000) {
					lastHbPersistedAt = lastHbAt;
					await saveSession();
				}
				return undefined;
			}
			case 'visibility':
				// background tabs throttle timers, a missing heartbeat there is not a freeze
				hidden = msg.hidden;
				lastHbAt = Date.now();
				return undefined;
			case 'dump':
				return {
					reqId: msg.reqId,
					result: await storage.readAll(),
				};
			case 'clear':
				await storage.clear();
				return {
					reqId: msg.reqId,
				};
			case 'stats':
				return {
					reqId: msg.reqId,
					result: await storage.stats(),
				};
		}
	};

	return {
		handle,
		checkStall,
		close: () => storage.close(),
	};
}
