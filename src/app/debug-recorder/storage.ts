import {
	DB_NAME,
	DB_VERSION,
	EVICTION_BATCH,
	MAX_RECORDS,
	RETENTION_MS,
} from './config';
import { type RecorderStats, type StoredRecord, tallyChannel } from './types';

const EVENTS = 'events';
const META = 'meta';

function promisify<T>(request: IDBRequest<T>): Promise<T> {
	return new Promise((resolve, reject) => {
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

function done(tx: IDBTransaction): Promise<void> {
	return new Promise((resolve, reject) => {
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
		tx.onabort = () => reject(tx.error);
	});
}

export interface RecorderStorage {
	append(records: StoredRecord[]): Promise<void>;
	readAll(): Promise<StoredRecord[]>;
	clear(): Promise<void>;
	stats(): Promise<RecorderStats>;
	getMeta<T>(key: string): Promise<T | undefined>;
	setMeta(key: string, value: unknown): Promise<void>;
	close(): void;
}

// IndexedDB ring buffer; opened in the worker, or on the main thread as a fallback
export async function openStorage(): Promise<RecorderStorage> {
	const open = indexedDB.open(DB_NAME, DB_VERSION);
	open.onupgradeneeded = () => {
		const db = open.result;
		if (!db.objectStoreNames.contains(EVENTS)) {
			db.createObjectStore(EVENTS, {
				autoIncrement: true,
			});
		}
		if (!db.objectStoreNames.contains(META)) {
			db.createObjectStore(META);
		}
	};
	const db = await promisify(open);

	// retention: records are in time order, so walk from the oldest until a fresh one
	const cutoff = Date.now() - RETENTION_MS;
	const retentionTx = db.transaction(EVENTS, 'readwrite');
	const retentionCursor = retentionTx.objectStore(EVENTS).openCursor();
	retentionCursor.onsuccess = () => {
		const cursor = retentionCursor.result;
		if (cursor && (cursor.value as StoredRecord).t < cutoff) {
			cursor.delete();
			cursor.continue();
		}
	};
	await done(retentionTx);

	let count = await promisify(
		db.transaction(EVENTS, 'readonly').objectStore(EVENTS).count(),
	);

	// keys are auto-increment and only the oldest are deleted, so they stay contiguous
	const evict = async () => {
		const excess = count - MAX_RECORDS + EVICTION_BATCH;
		const tx = db.transaction(EVENTS, 'readwrite');
		const store = tx.objectStore(EVENTS);
		const cursor = await promisify(store.openKeyCursor());
		if (cursor) {
			const firstKey = cursor.key as number;
			store.delete(IDBKeyRange.upperBound(firstKey + excess - 1));
		}
		await done(tx);
		count = await promisify(
			db.transaction(EVENTS, 'readonly').objectStore(EVENTS).count(),
		);
	};

	return {
		async append(records) {
			if (!records.length) return;
			const tx = db.transaction(EVENTS, 'readwrite');
			const store = tx.objectStore(EVENTS);
			for (const record of records) store.add(record);
			await done(tx);
			count += records.length;
			if (count > MAX_RECORDS) await evict();
		},

		async readAll() {
			return promisify(
				db
					.transaction(EVENTS, 'readonly')
					.objectStore(EVENTS)
					.getAll() as IDBRequest<StoredRecord[]>,
			);
		},

		async clear() {
			const tx = db.transaction(
				[
					EVENTS,
					META,
				],
				'readwrite',
			);
			tx.objectStore(EVENTS).clear();
			tx.objectStore(META).clear();
			await done(tx);
			count = 0;
		},

		async stats() {
			const stats: RecorderStats = {
				records: 0,
				chars: 0,
				firstT: null,
				lastT: null,
				byChannel: {},
			};
			const tx = db.transaction(EVENTS, 'readonly');
			const request = tx.objectStore(EVENTS).openCursor();
			await new Promise<void>((resolve, reject) => {
				request.onerror = () => reject(request.error);
				request.onsuccess = () => {
					const cursor = request.result;
					if (!cursor) return resolve();
					const { t, ch, n } = cursor.value as StoredRecord;
					stats.records += 1;
					stats.chars += n;
					stats.firstT = stats.firstT === null ? t : Math.min(stats.firstT, t);
					stats.lastT = stats.lastT === null ? t : Math.max(stats.lastT, t);
					tallyChannel(stats.byChannel, ch, n);
					cursor.continue();
				};
			});
			return stats;
		},

		async getMeta<T>(key: string) {
			return promisify(
				db.transaction(META, 'readonly').objectStore(META).get(key),
			) as Promise<T | undefined>;
		},

		close() {
			db.close();
		},

		async setMeta(key, value) {
			const tx = db.transaction(META, 'readwrite');
			tx.objectStore(META).put(value, key);
			await done(tx);
		},
	};
}
