import {
	CLEAN_EXIT_STORAGE_KEY,
	FLUSH_INTERVAL_MS,
	FLUSH_QUEUE_SIZE,
	HEARTBEAT_INTERVAL_MS,
	MAX_EVENT_CHARS,
	REQUEST_TIMEOUT_MS,
} from './config';
import {
	type RecorderChannel,
	type RecorderStats,
	type StoredRecord,
	WORKER_READY_ID,
	type WorkerRequest,
	type WorkerResponse,
} from './types';

type Respond = (res: WorkerResponse) => void;

type Transport = {
	post(msg: WorkerRequest): void;
	/** stops the worker / closes the inline DB connection, so the database can be deleted */
	terminate(): void;
};

const WORKER_LOAD_TIMEOUT_MS = 10_000;
// logout waits for destroy(): keep it short, the database is deleted afterwards anyway
const DESTROY_CLEAR_TIMEOUT_MS = 2_000;

// no worker (CSP, failed chunk, old browser): same logic on the main thread, no freeze detection
function inlineTransport(respond: Respond): Transport {
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
		terminate: () => {
			corePromise.then((core) => core.close()).catch(() => {});
		},
	};
}

// a worker that fails to load only fires an async `error`, so messages are replayed to the inline transport until it is ready
function workerWithFallback(
	respond: Respond,
	onFallback: () => void,
): Transport {
	let worker: Worker;
	try {
		worker = new Worker(new URL('./recorder.worker.ts', import.meta.url), {
			type: 'module',
			name: 'wt-debug-recorder',
		});
	} catch {
		onFallback();
		return inlineTransport(respond);
	}

	let ready = false;
	let inline: Transport | null = null;
	const replay: WorkerRequest[] = [];

	const fallBack = () => {
		if (ready || inline) return;
		clearTimeout(loadTimer);
		worker.terminate();
		inline = inlineTransport(respond);
		for (const msg of replay) inline.post(msg);
		replay.length = 0;
		onFallback();
	};
	const loadTimer = setTimeout(fallBack, WORKER_LOAD_TIMEOUT_MS);

	worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
		if (event.data.reqId === WORKER_READY_ID) {
			ready = true;
			clearTimeout(loadTimer);
			replay.length = 0;
			return;
		}
		respond(event.data);
	};
	worker.onerror = (event) => {
		if (ready) return;
		event.preventDefault();
		fallBack();
	};

	return {
		post: (msg) => {
			if (inline) return inline.post(msg);
			if (!ready) replay.push(msg);
			worker.postMessage(msg);
		},
		terminate: () => {
			clearTimeout(loadTimer);
			if (inline) inline.terminate();
			else worker.terminate();
		},
	};
}

// main-thread side: serializes and batches events for the worker; only the unflushed batch can be lost
export class RecorderSink {
	readonly sid: string;
	private transport: Transport;
	private queue: StoredRecord[] = [];
	private flushTimer: ReturnType<typeof setTimeout> | null = null;
	private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
	private reqId = WORKER_READY_ID;
	private stopped = false;
	private worker = true;
	private pending = new Map<
		number,
		{
			resolve: (v: unknown) => void;
			reject: (e: Error) => void;
			timer: ReturnType<typeof setTimeout>;
		}
	>();

	private readonly onVisibility = () =>
		this.transport.post({
			kind: 'visibility',
			hidden: document.visibilityState === 'hidden',
		});

	constructor() {
		this.sid =
			typeof crypto.randomUUID === 'function'
				? crypto.randomUUID()
				: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
		this.transport = workerWithFallback(
			(res) => this.settle(res),
			() => {
				this.worker = false;
			},
		);
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

	get usesWorker(): boolean {
		return this.worker;
	}

	private settle(res: WorkerResponse): void {
		const waiter = this.pending.get(res.reqId);
		if (!waiter) return;
		this.pending.delete(res.reqId);
		clearTimeout(waiter.timer);
		if (res.error) waiter.reject(new Error(res.error));
		else waiter.resolve(res.result);
	}

	record(ch: RecorderChannel, type: string, data?: unknown): void {
		if (this.stopped) return;
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
			sid: this.sid,
			type,
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
		this.heartbeatTimer = setInterval(
			() =>
				this.transport.post({
					kind: 'hb',
					t: Date.now(),
				}),
			HEARTBEAT_INTERVAL_MS,
		);
		document.addEventListener('visibilitychange', this.onVisibility);
	}

	// pagehide: the worker dies with the page, so the marker is written synchronously to localStorage
	markCleanExit(): void {
		if (this.stopped) return;
		this.flush();
		try {
			localStorage.setItem(CLEAN_EXIT_STORAGE_KEY, this.sid);
		} catch {
			// storage blocked: the next page-load reports this exit as not clean
		}
	}

	// restored from bfcache: the page-load goes on, so its earlier pagehide was not an exit
	markResumed(): void {
		try {
			if (localStorage.getItem(CLEAN_EXIT_STORAGE_KEY) === this.sid) {
				localStorage.removeItem(CLEAN_EXIT_STORAGE_KEY);
			}
		} catch {
			// storage blocked: nothing was written either
		}
	}

	// stops recording, clears the store (time-bounded) and terminates the worker; never rejects
	async destroy(): Promise<void> {
		this.stopped = true;
		this.queue = [];
		if (this.flushTimer) clearTimeout(this.flushTimer);
		this.flushTimer = null;
		if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
		document.removeEventListener('visibilitychange', this.onVisibility);
		try {
			await this.request('clear', DESTROY_CLEAR_TIMEOUT_MS);
		} catch {
			// the caller deletes the whole database right after
		}
		this.transport.terminate();
	}

	private request<T>(
		kind: 'dump' | 'clear' | 'stats',
		timeoutMs = REQUEST_TIMEOUT_MS,
	): Promise<T> {
		this.flush();
		const reqId = ++this.reqId;
		return new Promise<T>((resolve, reject) => {
			const timer = setTimeout(() => {
				this.pending.delete(reqId);
				reject(new Error(`debug recorder: "${kind}" timed out`));
			}, timeoutMs);
			this.pending.set(reqId, {
				resolve: resolve as (v: unknown) => void,
				reject,
				timer,
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

	stats(): Promise<RecorderStats> {
		return this.request('stats');
	}
}
