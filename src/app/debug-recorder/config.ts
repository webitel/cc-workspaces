export const RECORDER_VERSION = '0.1.0-spike';

/** localStorage key that keeps the recorder on across reloads; holds the expiry time */
export const ENABLED_STORAGE_KEY = 'wt-debug-recorder';
/** set while the store may hold records, so a disabled start knows to wipe it */
export const HAS_DATA_STORAGE_KEY = 'wt-debug-recorder:has-data';
/** recording switches itself off after this, so a forgotten flag does not record for days */
export const ENABLED_TTL_MS = 24 * 60 * 60 * 1000;
/** records older than this are dropped when the store opens */
export const RETENTION_MS = 48 * 60 * 60 * 1000;
/** sid of the last page-load that reached pagehide; written synchronously on exit */
export const CLEAN_EXIT_STORAGE_KEY = 'wt-debug-recorder:clean-exit';
/** `?debug=1` turns the recorder on, `?debug=0` turns it off */
export const URL_PARAM = 'debug';

export const DB_NAME = 'wt-debug-recorder';
export const DB_VERSION = 1;

/** ring buffer size: the oldest records are dropped above this */
export const MAX_RECORDS = 100_000;
export const EVICTION_BATCH = 5_000;

/** a single string inside an event is cut above this */
export const MAX_TEXT_CHARS = 16_384;
/** a whole serialized event is replaced by a preview above this */
export const MAX_EVENT_CHARS = 65_536;

export const FLUSH_INTERVAL_MS = 250;
export const FLUSH_QUEUE_SIZE = 200;

export const HEARTBEAT_INTERVAL_MS = 1_000;
export const STALL_THRESHOLD_MS = 3_000;

export const WEBRTC_STATS_INTERVAL_MS = 5_000;
export const LONG_FRAME_THRESHOLD_MS = 200;

function readUrlFlag(): string | null {
	const fromSearch = new URLSearchParams(window.location.search).get(URL_PARAM);
	if (fromSearch !== null) return fromSearch;
	const hashQuery = window.location.hash.split('?')[1];
	return hashQuery ? new URLSearchParams(hashQuery).get(URL_PARAM) : null;
}

export function setEnabled(enabled: boolean, now = Date.now()): void {
	if (enabled) {
		localStorage.setItem(ENABLED_STORAGE_KEY, String(now + ENABLED_TTL_MS));
	} else {
		localStorage.removeItem(ENABLED_STORAGE_KEY);
	}
}

/**
 * Reads the URL flag (persisting it) and falls back to the stored one.
 * The URL flag is honoured without login on purpose: the recorder must work
 * when login itself is what fails. The TTL, the REC indicator and wiping on
 * logout/disable limit what a forgotten flag can collect.
 */
export function resolveEnabled(now = Date.now()): boolean {
	try {
		const urlFlag = readUrlFlag();
		if (urlFlag === '1' || urlFlag === 'true') setEnabled(true, now);
		else if (urlFlag === '0' || urlFlag === 'false') setEnabled(false);

		const expiresAt = Number(localStorage.getItem(ENABLED_STORAGE_KEY));
		if (expiresAt > now) return true;
		setEnabled(false);
		return false;
	} catch {
		return false;
	}
}
