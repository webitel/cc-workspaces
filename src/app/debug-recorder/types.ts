export type RecorderChannel =
	| 'console'
	| 'error'
	| 'http'
	| 'ws'
	| 'sip'
	| 'webrtc'
	| 'device'
	| 'env'
	| 'lifecycle'
	| 'perf'
	| 'recorder';

export interface RecorderEvent {
	/** epoch ms */
	t: number;
	/** page-load session id: a new one after every F5 */
	sid: string;
	ch: RecorderChannel;
	type: string;
	data?: unknown;
}

/** what is stored in IndexedDB: the event is serialized once, on the main thread */
export interface StoredRecord {
	t: number;
	ch: RecorderChannel;
	/** length of `json`, used for volume stats */
	n: number;
	json: string;
}

export type RecordFn = (
	ch: RecorderChannel,
	type: string,
	data?: unknown,
) => void;

export interface RecorderStats {
	records: number;
	chars: number;
	firstT: number | null;
	lastT: number | null;
	byChannel: Record<
		string,
		{
			count: number;
			chars: number;
		}
	>;
}

export type WorkerRequest =
	| {
			kind: 'init';
			sid: string;
			t: number;
			/** sid of the page-load that reached pagehide, read from localStorage */
			cleanExitSid: string | null;
	  }
	| {
			kind: 'events';
			events: StoredRecord[];
	  }
	| {
			kind: 'hb';
			t: number;
	  }
	| {
			kind: 'visibility';
			hidden: boolean;
	  }
	| {
			kind: 'dump' | 'clear' | 'stats';
			reqId: number;
	  };

export interface WorkerResponse {
	reqId: number;
	result?: unknown;
	error?: string;
}
