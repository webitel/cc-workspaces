import { HEARTBEAT_INTERVAL_MS } from './config';
import { createRecorderCore } from './recorder-core';
import { openStorage } from './storage';
import type { WorkerRequest, WorkerResponse } from './types';

// typed by hand: pulling the `webworker` lib into the app tsconfig clashes with `dom`
const ctx = self as unknown as {
	postMessage(message: WorkerResponse): void;
	onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null;
};

const corePromise = openStorage().then(createRecorderCore);

// messages are handled strictly in order, so a dump sees every batch posted before it
let queue: Promise<unknown> = Promise.resolve();
const enqueue = (task: () => Promise<unknown>) => {
	queue = queue.then(task).catch(() => {});
};

ctx.onmessage = (event) => {
	const msg = event.data;
	enqueue(async () => {
		try {
			const response = await (await corePromise).handle(msg);
			if (response) ctx.postMessage(response);
		} catch (err) {
			if ('reqId' in msg) {
				ctx.postMessage({
					reqId: msg.reqId,
					error: String(err),
				});
			}
		}
	});
};

setInterval(() => {
	enqueue(async () => (await corePromise).checkStall());
}, HEARTBEAT_INTERVAL_MS);
