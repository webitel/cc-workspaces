import { describe, expect, it } from 'vitest';
import { buildReport } from '../report';
import { buildTimeline, timelineEntries } from '../timeline';
import type { RecorderChannel, StoredRecord } from '../types';

const T0 = new Date(2026, 10, 18, 18, 31, 15, 0).getTime();

function rec(
	offsetMs: number,
	ch: RecorderChannel,
	type: string,
	data: unknown,
	sid = 'session-a',
): StoredRecord {
	const t = T0 + offsetMs;
	const json = JSON.stringify({
		t,
		sid,
		ch,
		type,
		data,
	});
	return {
		t,
		ch,
		sid,
		type,
		n: json.length,
		json,
	};
}

const records = [
	rec(0, 'recorder', 'start', {
		worker: true,
		failedCollectors: [],
	}),
	rec(10, 'http', 'xhr:start', {
		id: 1,
		method: 'GET',
		url: '/api/userinfo',
	}),
	rec(44, 'http', 'xhr:end', {
		id: 1,
		method: 'GET',
		url: '/api/userinfo',
		status: 200,
		durationMs: 34,
	}),
	rec(50, 'http', 'fetch:start', {
		id: 2,
		method: 'POST',
		url: '/api/call',
	}),
	rec(100, 'sip', 'ws:out', {
		id: 1,
		keepAlive: true,
	}),
	rec(150, 'sip', 'ws:in', {
		id: 1,
		line: 'SIP/2.0 407 Proxy Authentication Required',
	}),
	rec(200, 'sip', 'ws:in', {
		id: 1,
		line: 'SIP/2.0 486 Busy Here',
		callId: 'abc',
		cseq: '2 INVITE',
	}),
	rec(90_000, 'webrtc', 'pc:connectionstatechange', {
		id: 1,
		state: 'failed',
	}),
	rec(
		91_000,
		'recorder',
		'previous-session',
		{
			sid: 'session-a',
			cleanExit: false,
		},
		'session-b',
	),
	rec(
		91_200,
		'http',
		'fetch:start',
		{
			id: 1,
			method: 'GET',
			url: '/api/late',
		},
		'session-b',
	),
	rec(
		91_500,
		'console',
		'log',
		{
			args: [
				'</script><img src=x onerror=alert(1)>',
			],
		},
		'session-b',
	),
];

describe('timeline', () => {
	it('folds http starts and keep-alives, flags unanswered requests', () => {
		const entries = timelineEntries(records);
		expect(
			entries.map((e) => [
				e.session,
				e.problem ? '!' : ' ',
				e.text,
			]),
		).toEqual([
			[
				1,
				' ',
				'recording started · worker',
			],
			[
				1,
				' ',
				'GET /api/userinfo → 200 · 34 ms',
			],
			[
				1,
				'!',
				'POST /api/call → no response recorded in 1 min 30 s',
			],
			[
				1,
				' ',
				'ws#1 ← SIP/2.0 407 Proxy Authentication Required',
			],
			[
				1,
				'!',
				'ws#1 ← SIP/2.0 486 Busy Here (Call-ID abc, CSeq 2 INVITE)',
			],
			[
				1,
				'!',
				'pc#1 connection → failed',
			],
			[
				2,
				'!',
				'previous page load did NOT close normally (crash, kill or frozen tab)',
			],
			[
				2,
				' ',
				'GET /api/late → no response recorded (page closed or export taken first)',
			],
			[
				2,
				' ',
				'log   </script><img src=x onerror=alert(1)>',
			],
		]);
	});

	it('renders a readable text file with problems on top, page loads and quiet gaps', () => {
		const text = buildTimeline(timelineEntries(records));
		expect(text).toContain('Likely problems (4):');
		expect(text).toContain(
			'══════ Page load 2 · 2026-11-18 18:32:46.000 · session session-',
		);
		expect(text).toContain('··· 1 min 30 s without events ···');
		expect(text).toContain(
			'18:31:15.044   http      GET /api/userinfo → 200 · 34 ms',
		);
		expect(text).toContain(
			'18:31:15.200 ! sip       ws#1 ← SIP/2.0 486 Busy Here',
		);
	});
});

describe('report.html', () => {
	it('embeds recorded text so it cannot break out of the script tag', () => {
		const entries = timelineEntries(records);
		const html = buildReport(records, entries, {
			generatedAt: '2026-11-18T16:40:00.000Z',
			recorder: 'test',
			app: '26.12.0',
			origin: 'http://localhost',
			userAgent: 'test',
		});
		const scripts = html.match(/<\/script>/g) ?? [];
		expect(scripts).toHaveLength(3);
		expect(html).toContain('\\u003c/script>\\u003cimg');

		const data =
			/<script type="application\/json" id="report-data">([\s\S]*?)<\/script>/.exec(
				html,
			)?.[1];
		const parsed = JSON.parse(data ?? '');
		expect(parsed.rows).toHaveLength(entries.length);
		expect(
			parsed.sessions.map((s: { problems: number }) => s.problems),
		).toEqual([
			3,
			1,
		]);
	});
});
