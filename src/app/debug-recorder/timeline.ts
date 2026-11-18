import { REQUEST_TIMEOUT_MS } from './config';
import type { RecorderEvent, StoredRecord } from './types';

type Data = Record<string, unknown>;
type Stat = Record<string, unknown> & {
	type?: string;
	id?: string;
};

interface Line {
	text: string;
	problem?: boolean;
}

const QUIET_GAP_MS = 60_000;
const MAX_INLINE = 300;
const MAX_PROBLEMS = 100;
// digest auth challenges and a cancelled INVITE are routine
const EXPECTED_SIP_CODES = new Set([
	401,
	407,
	487,
]);

const pad2 = (n: number) => String(n).padStart(2, '0');

export function clock(t: number): string {
	const d = new Date(t);
	return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}.${String(d.getMilliseconds()).padStart(3, '0')}`;
}

export function day(t: number): string {
	const d = new Date(t);
	return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function utcOffset(t: number): string {
	const minutes = -new Date(t).getTimezoneOffset();
	const sign = minutes >= 0 ? '+' : '-';
	const abs = Math.abs(minutes);
	return `UTC${sign}${pad2(Math.floor(abs / 60))}:${pad2(abs % 60)}`;
}

export function duration(ms: number): string {
	if (ms < 1_000) return `${Math.round(ms)} ms`;
	if (ms < 60_000) return `${(ms / 1_000).toFixed(1)} s`;
	const minutes = Math.round(ms / 60_000);
	if (ms < 600_000) {
		const seconds = Math.round(ms / 1_000);
		return `${Math.floor(seconds / 60)} min ${seconds % 60} s`;
	}
	if (minutes < 60) return `${minutes} min`;
	return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}

function clip(text: string, max = MAX_INLINE): string {
	const flat = text.replace(/\s+/g, ' ').trim();
	return flat.length > max ? `${flat.slice(0, max)}…` : flat;
}

function compact(value: unknown, max = MAX_INLINE): string {
	if (value === undefined) return '';
	if (typeof value === 'string') return clip(value, max);
	try {
		return clip(JSON.stringify(value), max);
	} catch {
		return clip(String(value), max);
	}
}

function errorText(value: unknown): string {
	if (value && typeof value === 'object') {
		const { name, message } = value as Data;
		if (message) return compact(name ? `${name}: ${message}` : message);
	}
	return compact(value);
}

const ok = (text: string): Line => ({
	text,
});
const bad = (text: string): Line => ({
	text,
	problem: true,
});

function http(type: string, d: Data): Line | null {
	if (type.endsWith(':start')) return null;
	const head = `${d.method} ${d.url}`;
	if (type.endsWith(':fail')) {
		return bad(
			`${head} ✗ ${errorText(d.error)} · ${duration(Number(d.durationMs))}`,
		);
	}
	const status = Number(d.status);
	const text = `${head} → ${status || 'network error'} · ${duration(Number(d.durationMs))}`;
	if (status > 0 && status < 400) return ok(text);
	return bad(d.body === undefined ? text : `${text} · ${compact(d.body, 200)}`);
}

function socket(ch: string, type: string, d: Data): Line | null {
	const tag = `ws#${d.id}`;
	switch (type) {
		case 'ws:create': {
			const protocols = (d.protocols as string[] | undefined)?.join(',');
			return ok(
				`${tag} connecting ${d.url}${protocols ? ` [${protocols}]` : ''}`,
			);
		}
		case 'ws:open':
			return ok(`${tag} open`);
		case 'ws:error':
			return bad(`${tag} error`);
		case 'ws:close': {
			const text = `${tag} closed · code ${d.code}${d.reason ? ` "${d.reason}"` : ''}`;
			return d.wasClean ? ok(text) : bad(`${text} · not clean`);
		}
	}
	if (d.keepAlive) return null;
	const arrow = type === 'ws:out' ? '→' : '←';
	if (ch === 'sip' && d.line) {
		const ids = [
			d.callId && `Call-ID ${d.callId}`,
			d.cseq && `CSeq ${d.cseq}`,
		]
			.filter(Boolean)
			.join(', ');
		const line = String(d.line);
		const code = Number(/^SIP\/2\.0 (\d{3})/.exec(line)?.[1]);
		const text = `${tag} ${arrow} ${line}${ids ? ` (${ids})` : ''}`;
		return code >= 400 && !EXPECTED_SIP_CODES.has(code) ? bad(text) : ok(text);
	}
	const payload =
		d.msg ?? d.text ?? (d.binary !== undefined ? `[binary ${d.binary}]` : '');
	return ok(`${tag} ${arrow} ${compact(payload)}`);
}

function findStat(
	stats: Stat[],
	type: string,
	kind?: string,
): Stat | undefined {
	return stats.find((s) => s.type === type && (!kind || s.kind === kind));
}

function candidate(stat?: Stat): string {
	if (!stat) return '';
	const where = stat.address ? ` ${stat.address}:${stat.port}` : '';
	return `${stat.candidateType} ${stat.protocol}${where}`;
}

function rtcStats(tag: string, stats: Stat[]): Line {
	const parts: string[] = [];
	const remote = findStat(stats, 'remote-inbound-rtp', 'audio');
	const pair = findStat(stats, 'candidate-pair');
	const rtt = Number(remote?.roundTripTime ?? pair?.currentRoundTripTime);
	if (rtt >= 0) parts.push(`rtt ${Math.round(rtt * 1_000)} ms`);

	const inbound = findStat(stats, 'inbound-rtp', 'audio');
	let lossRatio = 0;
	if (inbound) {
		const lost = Number(inbound.packetsLost ?? 0);
		const received = Number(inbound.packetsReceived ?? 0);
		lossRatio = lost + received > 0 ? lost / (lost + received) : 0;
		parts.push(`jitter ${Math.round(Number(inbound.jitter ?? 0) * 1_000)} ms`);
		parts.push(`lost ${lost}/${lost + received}`);
	}
	const outbound = findStat(stats, 'outbound-rtp', 'audio');
	if (outbound) parts.push(`sent ${outbound.packetsSent ?? 0} pkts`);

	const codecId = (inbound ?? outbound)?.codecId;
	const codec = stats.find((s) => s.id === codecId);
	if (codec?.mimeType)
		parts.push(String(codec.mimeType).replace(/^audio\//, ''));
	if (pair) {
		const local = stats.find((s) => s.id === pair.localCandidateId);
		const remoteCandidate = stats.find((s) => s.id === pair.remoteCandidateId);
		parts.push(`via ${candidate(local)} ⇄ ${candidate(remoteCandidate)}`);
	}
	const text = `${tag} stats · ${parts.join(' · ') || 'no audio yet'}`;
	return lossRatio > 0.05 || rtt > 0.4 ? bad(text) : ok(text);
}

function webrtc(type: string, d: Data): Line {
	const tag = `pc#${d.id}`;
	switch (type) {
		case 'pc:create': {
			const config = (d.config ?? {}) as Data;
			const servers = (config.iceServers as unknown[] | undefined)?.length ?? 0;
			return ok(
				`${tag} created · ${servers} ICE server(s)${config.iceTransportPolicy ? ` · ${config.iceTransportPolicy}` : ''}`,
			);
		}
		case 'pc:stats':
			return rtcStats(tag, (d.stats as Stat[] | undefined) ?? []);
		case 'pc:stats-error':
			return bad(`${tag} getStats failed · ${errorText(d.error)}`);
		case 'pc:icecandidateerror':
			return bad(
				`${tag} ICE candidate error ${d.errorCode} ${d.errorText ?? ''} · ${d.url ?? ''} ${d.address ?? ''}:${d.port ?? ''}`,
			);
		case 'pc:track':
			return ok(`${tag} remote ${d.kind} track`);
		case 'pc:closed':
			return ok(`${tag} closed${d.collected ? ' (garbage-collected)' : ''}`);
	}
	if (d.state !== undefined) {
		const what = type
			.replace(/^pc:/, '')
			.replace(/statechange$/, '')
			.replace('iceconnection', 'ice')
			.replace('icegathering', 'ice gathering');
		const text = `${tag} ${what} → ${d.state}`;
		return d.state === 'failed' || d.state === 'disconnected'
			? bad(text)
			: ok(text);
	}
	return ok(`${tag} ${type} ${compact(d)}`);
}

function track(t?: Data): string {
	if (!t) return '';
	return `${t.kind} "${t.label || '?'}" ${t.readyState}${t.muted ? ' muted' : ''}${t.enabled === false ? ' disabled' : ''}`;
}

function device(type: string, d: Data): Line {
	switch (type) {
		case 'devices': {
			const list = (d.devices as Data[] | undefined) ?? [];
			const byKind = (kind: string) => list.filter((x) => x.kind === kind);
			const names = (kind: string) =>
				byKind(kind)
					.map((x) => `"${x.label || '?'}"`)
					.join(', ');
			return ok(
				`devices (${d.reason}) · mics ${byKind('audioinput').length}: ${names('audioinput') || '—'} · speakers ${byKind('audiooutput').length}: ${names('audiooutput') || '—'} · cameras ${byKind('videoinput').length}`,
			);
		}
		case 'devices-error':
			return bad(`device list failed · ${errorText(d.error)}`);
		case 'permission': {
			const text = `${d.name} permission: ${d.state}${d.changed ? ' (changed)' : ''}`;
			return d.state === 'denied' ? bad(text) : ok(text);
		}
		case 'getUserMedia':
			return ok(`getUserMedia ${compact(d.constraints, 200)}`);
		case 'getUserMedia:ok':
			return ok(
				`getUserMedia ok · ${((d.tracks as Data[] | undefined) ?? []).map(track).join(', ')}`,
			);
		case 'getUserMedia:fail':
			return bad(
				`getUserMedia failed · ${d.name}: ${d.message}${d.constraint ? ` (${d.constraint})` : ''}`,
			);
		case 'unavailable':
			return bad(
				`mediaDevices unavailable · secure context: ${d.secureContext}`,
			);
	}
	if (type.startsWith('track:')) {
		const event = type.slice('track:'.length);
		const text = `track ${event} · ${track(d)}`;
		return event === 'mute' ? bad(text) : ok(text);
	}
	return ok(`${type} ${compact(d)}`);
}

function recorder(type: string, d: Data): Line {
	switch (type) {
		case 'start': {
			const failed = (d.failedCollectors as string[] | undefined) ?? [];
			const text = `recording started · ${d.worker ? 'worker' : 'inline storage'}`;
			return failed.length
				? bad(`${text} · failed collectors: ${failed.join(', ')}`)
				: ok(text);
		}
		case 'previous-session': {
			if (d.cleanExit) return ok('previous page load closed normally');
			const last = d.lastHeartbeat
				? ` · last sign of life ${clock(Number(d.lastHeartbeat))}`
				: '';
			const frozen = d.stallSince
				? ` · frozen since ${clock(Number(d.stallSince))}`
				: '';
			return bad(
				`previous page load did NOT close normally (crash, kill or frozen tab)${last}${frozen}`,
			);
		}
		case 'main-thread-stall-start':
			return bad(`page frozen · no heartbeat for ${duration(Number(d.gapMs))}`);
		case 'main-thread-stall-end':
			return bad(`page unfrozen after ${duration(Number(d.durationMs))}`);
	}
	return ok(`${type} ${compact(d)}`);
}

function describe(event: RecorderEvent): Line | null {
	const d = (event.data ?? {}) as Data;
	switch (event.ch) {
		case 'console': {
			const args = ((d.args as unknown[] | undefined) ?? [])
				.map((a) => compact(a, 200))
				.join(' ');
			const text = `${event.type.padEnd(5)} ${clip(args)}`;
			return event.type === 'error' ? bad(text) : ok(text);
		}
		case 'error':
			switch (event.type) {
				case 'resource':
					return bad(`failed to load <${d.tag}> ${d.url}`);
				case 'uncaught':
					return bad(
						`uncaught ${errorText(d.error ?? d.message)}${d.source ? ` · at ${d.source}:${d.line}:${d.column}` : ''}`,
					);
				case 'unhandledrejection':
					return bad(`unhandled promise rejection · ${errorText(d.reason)}`);
				case 'csp':
					return bad(`CSP blocked ${d.blocked} (${d.directive})`);
				default:
					return bad(`${event.type} ${compact(d)}`);
			}
		case 'http':
			return http(event.type, d);
		case 'ws':
		case 'sip':
			return socket(event.ch, event.type, d);
		case 'webrtc':
			return webrtc(event.type, d);
		case 'device':
			return device(event.type, d);
		case 'env':
			if (event.type === 'snapshot') {
				return ok(
					`app ${d.app} · recorder ${d.recorder} · ${d.origin}${d.path} · electron: ${d.electron ? 'yes' : 'no'} · ${d.userAgent}`,
				);
			}
			return ok(`${event.type} ${compact(d)}`);
		case 'lifecycle':
			switch (event.type) {
				case 'offline':
					return bad('browser went offline');
				case 'online':
					return ok('browser back online');
				case 'visibility':
					return ok(`tab ${d.state}`);
				case 'pagehide':
				case 'pageshow':
					return ok(
						`${event.type}${d.persisted ? ' (back/forward cache)' : ''}`,
					);
				default:
					return ok(event.type);
			}
		case 'perf': {
			const scripts = ((d.scripts as Data[] | undefined) ?? []).map((s) =>
				`${s.fn || '?'} ${s.source ?? ''} ${s.durationMs} ms`.trim(),
			);
			const text = `long frame ${duration(Number(d.durationMs))} · blocking ${duration(Number(d.blockingMs))}${scripts.length ? ` · ${scripts.join('; ')}` : ''}`;
			return Number(d.durationMs) >= 1_000 ? bad(text) : ok(text);
		}
		case 'recorder':
			return recorder(event.type, d);
		default:
			return ok(`${event.type} ${compact(d)}`);
	}
}

export interface TimelineEntry {
	/** index into the sorted records, to look up the full event */
	index: number;
	t: number;
	/** 1-based page-load number */
	session: number;
	sid: string;
	ch: string;
	type: string;
	text: string;
	problem: boolean;
}

/** records must be sorted by time; HTTP starts and SIP keep-alives are folded away */
export function timelineEntries(records: StoredRecord[]): TimelineEntry[] {
	const events = records.map((r) => JSON.parse(r.json) as RecorderEvent);
	const ended = new Set<string>();
	const sessionEnd = new Map<string, number>();
	for (const event of events) {
		sessionEnd.set(event.sid, event.t);
		if (event.ch === 'http' && !event.type.endsWith(':start')) {
			ended.add(`${event.sid}:${(event.data as Data)?.id}`);
		}
	}

	const entries: TimelineEntry[] = [];
	let sid: string | null = null;
	let session = 0;
	events.forEach((event, index) => {
		let line = describe(event);
		if (
			!line &&
			event.ch === 'http' &&
			!ended.has(`${event.sid}:${(event.data as Data)?.id}`)
		) {
			const d = event.data as Data;
			const text = `${d.method} ${d.url} → no response recorded`;
			// the page closing mid-request is not a hang
			const waited = (sessionEnd.get(event.sid) ?? event.t) - event.t;
			line =
				waited >= REQUEST_TIMEOUT_MS
					? bad(`${text} in ${duration(waited)}`)
					: ok(`${text} (page closed or export taken first)`);
		}
		if (!line) return;
		if (event.sid !== sid) {
			sid = event.sid;
			session += 1;
		}
		entries.push({
			index,
			t: event.t,
			session,
			sid: event.sid,
			ch: event.ch,
			type: event.type,
			text: line.text,
			problem: Boolean(line.problem),
		});
	});
	return entries;
}

/** one line per event, grouped by page load; problems are marked with `!` and repeated at the top */
export function buildTimeline(entries: TimelineEntry[]): string {
	const body: string[] = [];
	const problems: string[] = [];
	let session = 0;
	let previousT = 0;
	let currentDay = '';
	for (const entry of entries) {
		if (entry.session !== session) {
			session = entry.session;
			currentDay = day(entry.t);
			body.push(
				'',
				`══════ Page load ${session} · ${currentDay} ${clock(entry.t)} · session ${entry.sid.slice(0, 8)} ══════`,
				'',
			);
		} else if (entry.t - previousT >= QUIET_GAP_MS) {
			body.push(
				`              ··· ${duration(entry.t - previousT)} without events ···`,
			);
		}
		if (day(entry.t) !== currentDay) {
			currentDay = day(entry.t);
			body.push(`              ─── ${currentDay} ───`);
		}
		previousT = entry.t;

		const row = `${clock(entry.t)} ${entry.problem ? '!' : ' '} ${entry.ch.padEnd(9)} ${entry.text}`;
		body.push(row);
		if (entry.problem) problems.push(`${day(entry.t)} ${row}`);
	}

	const first = entries[0]?.t ?? Date.now();
	const header = [
		'Webitel Workspace debug timeline',
		`Times are local (${utcOffset(first)}). "!" marks a likely problem. Every line has its full data in events.ndjson.`,
		'HTTP requests show once, when they finish. SIP keep-alives are left out.',
		'',
		problems.length
			? `Likely problems (${problems.length}):`
			: 'No likely problems found.',
		...problems.slice(0, MAX_PROBLEMS).map((p) => `  ${p}`),
		...(problems.length > MAX_PROBLEMS
			? [
					`  … and ${problems.length - MAX_PROBLEMS} more below`,
				]
			: []),
	];
	return `${[
		...header,
		...body,
	].join('\n')}\n`;
}
