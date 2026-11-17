import { RECORDER_VERSION } from './config';
import type { RecorderEvent, StoredRecord } from './types';

const README = `Webitel Workspace debug archive

manifest.json   when/where the archive was made
stats.json      volume per channel and per event type, per page-load session
events.ndjson   every recorded event, one JSON object per line, oldest first
sip.txt         SIP signalling as plain text, for a quick read

Event fields: t (epoch ms), sid (page-load session; a new one after every F5),
ch (console | error | http | ws | sip | webrtc | device | env | lifecycle | perf | recorder),
type, data.

Passwords, tokens, SIP Authorization headers are removed before anything is
written. Phone numbers (9+ digits) and e-mails are masked; chat texts are
replaced by their length.
`;

interface SessionStats {
	sid: string;
	first: number;
	last: number;
	records: number;
	chars: number;
}

export function buildStats(records: StoredRecord[]) {
	const byChannel: Record<
		string,
		{
			count: number;
			chars: number;
		}
	> = {};
	const byType: Record<string, number> = {};
	const sessions = new Map<string, SessionStats>();
	let chars = 0;

	for (const record of records) {
		chars += record.n;
		byChannel[record.ch] ??= {
			count: 0,
			chars: 0,
		};
		const ch = byChannel[record.ch];
		ch.count += 1;
		ch.chars += record.n;

		const event = JSON.parse(record.json) as RecorderEvent;
		const typeKey = `${event.ch}/${event.type}`;
		byType[typeKey] = (byType[typeKey] ?? 0) + 1;

		const session = sessions.get(event.sid);
		if (session) {
			session.last = Math.max(session.last, event.t);
			session.records += 1;
			session.chars += record.n;
		} else {
			sessions.set(event.sid, {
				sid: event.sid,
				first: event.t,
				last: event.t,
				records: 1,
				chars: record.n,
			});
		}
	}

	const first = records.length ? records[0].t : null;
	const last = records.length ? records[records.length - 1].t : null;
	const spanHours = first && last ? (last - first) / 3_600_000 : 0;

	return {
		records: records.length,
		chars,
		first: first && new Date(first).toISOString(),
		last: last && new Date(last).toISOString(),
		spanHours: Math.round(spanHours * 100) / 100,
		charsPerHour: spanHours > 0 ? Math.round(chars / spanHours) : null,
		byChannel,
		byType: Object.fromEntries(
			Object.entries(byType).sort(([, a], [, b]) => b - a),
		),
		sessions: [
			...sessions.values(),
		].map((s) => ({
			...s,
			first: new Date(s.first).toISOString(),
			last: new Date(s.last).toISOString(),
		})),
	};
}

export function buildSipText(records: StoredRecord[]): string {
	const lines: string[] = [];
	for (const record of records) {
		if (record.ch !== 'sip') continue;
		const event = JSON.parse(record.json) as RecorderEvent & {
			data: {
				id?: number;
				text?: string;
				keepAlive?: boolean;
				code?: number;
				url?: string;
			};
		};
		const time = new Date(event.t).toISOString();
		const { data } = event;
		if (data.keepAlive) continue;
		if (event.type === 'ws:out' || event.type === 'ws:in') {
			const arrow = event.type === 'ws:out' ? '>>> sent' : '<<< received';
			lines.push(`${time} ${arrow} (ws#${data.id})\n${data.text ?? ''}\n`);
		} else {
			lines.push(
				`${time} --- ${event.type} (ws#${data.id}) ${JSON.stringify(data)}\n`,
			);
		}
	}
	return lines.join('\n');
}

/** sorts, packs into a zip and triggers a browser download */
export async function downloadArchive(
	records: StoredRecord[],
	currentSid: string | null,
): Promise<void> {
	const { default: JSZip } = await import('jszip');
	const sorted = [
		...records,
	].sort((a, b) => a.t - b.t);
	const generatedAt = new Date();

	const zip = new JSZip();
	zip.file('README.txt', README);
	zip.file(
		'manifest.json',
		JSON.stringify(
			{
				generatedAt: generatedAt.toISOString(),
				recorder: RECORDER_VERSION,
				app: __APP_VERSION__,
				origin: location.origin,
				userAgent: navigator.userAgent,
				currentSession: currentSid,
			},
			null,
			2,
		),
	);
	zip.file('stats.json', JSON.stringify(buildStats(sorted), null, 2));
	zip.file('events.ndjson', sorted.map((r) => r.json).join('\n'));
	zip.file('sip.txt', buildSipText(sorted));

	const blob = await zip.generateAsync({
		type: 'blob',
		compression: 'DEFLATE',
		compressionOptions: {
			level: 6,
		},
	});
	const stamp = generatedAt.toISOString().replace(/[:.]/g, '-').slice(0, 19);
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `workspace-debug-${stamp}.zip`;
	document.body.appendChild(link);
	link.click();
	link.remove();
	setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
