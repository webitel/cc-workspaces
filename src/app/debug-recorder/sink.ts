import {
	CLEAN_EXIT_STORAGE_KEY,
	FLUSH_INTERVAL_MS,
	FLUSH_QUEUE_SIZE,
	HEARTBEAT_INTERVAL_MS,
	MAX_EVENT_CHARS,
} from './config';
import type {
	RecorderChannel,
	RecorderStats,
	StoredRecord,
	WorkerRequest,
	WorkerResponse,
} from './types';

type Transport = {
	post(msg: WorkerRequest): void;
	onResponse(cb: (res: WorkerResponse) => void): void;
};

function workerTransport(): Transport {
	const worker = new Worker(new URL('./recorder.worker.ts', import.meta.url), {
		type: 'module',
		name: 'wt-debug-recorder',
	});
	return {
		post: (msg) => worker.postMessage(msg),
		onResponse: (cb) => {
			worker.onmessage = (event: MessageEvent<WorkerResponse>) =>
				cb(event.data);
		},
	};
}

// no worker (CSP, old browser): same logic on the main thread, loses freeze detection
function inlineTransport(): Transport {
	let respond: (res: WorkerResponse) => void = () => {};
	const corePromise = Promise.all([
		import('./storage'),
		import('./recorder-core'),
	]).then(([{ openStorage }, { createRecorderCore }]) =>
		openStorage().then(createRecorderCore),
	);
	let queue: Promise<unknown> = Promise.resolve();
	return {
		post: (msg) => {
			queue = queue
				.then(async () => {
					const res = await (await corePromise).handle(msg);
					if (res) respond(res);
				})
				.catch((err) => {
					if ('reqId' in msg)
						respond({
							reqId: msg.reqId,
							error: String(err),
						});
				});
		},
		onResponse: (cb) => {
			respond = cb;
		},
	};
}

/**
 * Main-thread side: serializes events, batches them and hands them to the
 * worker. Everything posted is persisted even if the page freezes or reloads
 * right after; only the current, not yet flushed batch (< FLUSH_INTERVAL_MS) can be lost.
 */
export class RecorderSink {
	readonly sid: string;
	private transport: Transport;
	private queue: StoredRecord[] = [];
	private flushTimer: ReturnType<typeof setTimeout> | null = null;
	private reqId = 0;
	private pending = new Map<
		number,
		{
			resolve: (v: unknown) => void;
			reject: (e: Error) => void;
		}
	>();
	readonly usesWorker: boolean;

	constructor() {
		this.sid =
			typeof crypto.randomUUID === 'function'
				? crypto.randomUUID()
				: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
		let transport: Transport;
		try {
			transport = workerTransport();
			this.usesWorker = true;
		} catch {
			transport = inlineTransport();
			this.usesWorker = false;
		}
		this.transport = transport;
		this.transport.onResponse((res) => {
			const waiter = this.pending.get(res.reqId);
			if (!waiter) return;
			this.pending.delete(res.reqId);
			if (res.error) waiter.reject(new Error(res.error));
			else waiter.resolve(res.result);
		});
		let cleanExitSid: string | null = null;
		try {
			cleanExitSid = localStorage.getItem(CLEAN_EXIT_STORAGE_KEY);
			localStorage.removeItem(CLEAN_EXIT_STORAGE_KEY);
		} catch {
			// storage blocked: previous exit is reported as not clean
		}
		this.transport.post({
			kind: 'init',
			sid: this.sid,
			t: Date.now(),
			cleanExitSid,
		});
	}

	record(ch: RecorderChannel, type: string, data?: unknown): void {
		const t = Date.now();
		let json: string;
		try {
			json = JSON.stringify({
				t,
				sid: this.sid,
				ch,
				type,
				data,
			});
		} catch (err) {
			json = JSON.stringify({
				t,
				sid: this.sid,
				ch,
				type,
				data: `[Unserializable: ${(err as Error)?.message}]`,
			});
		}
		if (json.length > MAX_EVENT_CHARS) {
			json = JSON.stringify({
				t,
				sid: this.sid,
				ch,
				type,
				data: {
					truncated: true,
					chars: json.length,
					preview: json.slice(0, 4_096),
				},
			});
		}
		this.queue.push({
			t,
			ch,
			n: json.length,
			json,
		});
		if (this.queue.length >= FLUSH_QUEUE_SIZE) this.flush();
		else this.flushTimer ??= setTimeout(() => this.flush(), FLUSH_INTERVAL_MS);
	}

	flush(): void {
		if (this.flushTimer) {
			clearTimeout(this.flushTimer);
			this.flushTimer = null;
		}
		if (!this.queue.length) return;
		const events = this.queue;
		this.queue = [];
		this.transport.post({
			kind: 'events',
			events,
		});
	}

	startHeartbeat(): void {
		setInterval(
			() =>
				this.transport.post({
					kind: 'hb',
					t: Date.now(),
				}),
			HEARTBEAT_INTERVAL_MS,
		);
		document.addEventListener('visibilitychange', () => {
			this.transport.post({
				kind: 'visibility',
				hidden: document.visibilityState === 'hidden',
			});
		});
	}

	/**
	 * Called on pagehide. The worker dies with the page and may never process
	 * an async write posted now, so the marker goes to localStorage, synchronously.
	 */
	markCleanExit(): void {
		this.flush();
		try {
			localStorage.setItem(CLEAN_EXIT_STORAGE_KEY, this.sid);
		} catch {
			// storage blocked: the next page-load reports this exit as not clean
		}
	}

	private request<T>(kind: 'dump' | 'clear' | 'stats'): Promise<T> {
		this.flush();
		const reqId = ++this.reqId;
		return new Promise<T>((resolve, reject) => {
			this.pending.set(reqId, {
				resolve: resolve as (v: unknown) => void,
				reject,
			});
			this.transport.post({
				kind,
				reqId,
			});
		});
	}

	dump(): Promise<StoredRecord[]> {
		return this.request('dump');
	}

	clear(): Promise<void> {
		return this.request('clear');
	}

	stats(): Promise<RecorderStats> {
		return this.request('stats');
	}
}
