import {
	clock,
	day,
	duration,
	type TimelineEntry,
	utcOffset,
} from './timeline';
import type { StoredRecord } from './types';

export interface ReportMeta {
	generatedAt: string;
	recorder: string;
	app: string;
	origin: string;
	userAgent: string;
}

interface SessionRow {
	no: number;
	sid: string;
	start: string;
	end: string;
	events: number;
	problems: number;
}

function sessionRows(entries: TimelineEntry[]): SessionRow[] {
	const rows: SessionRow[] = [];
	for (const entry of entries) {
		let row = rows[entry.session - 1];
		if (!row) {
			row = {
				no: entry.session,
				sid: entry.sid.slice(0, 8),
				start: `${day(entry.t)} ${clock(entry.t)}`,
				end: '',
				events: 0,
				problems: 0,
			};
			rows.push(row);
		}
		row.end = clock(entry.t);
		row.events += 1;
		if (entry.problem) row.problems += 1;
	}
	return rows;
}

// `<` escaped so recorded text can never close the script tag
const embed = (json: string) => json.replace(/</g, '\\u003c');

/** self-contained page: no network, everything renders through textContent */
export function buildReport(
	records: StoredRecord[],
	entries: TimelineEntry[],
	meta: ReportMeta,
): string {
	const first = entries[0]?.t;
	const last = entries[entries.length - 1]?.t;
	const payload = {
		meta: {
			...meta,
			timezone: utcOffset(first ?? Date.now()),
			span:
				first && last
					? `${day(first)} ${clock(first)} – ${day(last)} ${clock(last)} (${duration(last - first)})`
					: '—',
			records: records.length,
		},
		sessions: sessionRows(entries),
		rows: entries.map((e) => [
			`${day(e.t)} ${clock(e.t)}`,
			e.session,
			e.ch,
			e.type,
			e.text,
			e.problem ? 1 : 0,
			e.index,
		]),
	};
	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'">
<title>Workspace debug report</title>
<style>${STYLE}</style>
</head>
<body>
<header>
	<h1>Workspace debug report</h1>
	<dl id="meta"></dl>
</header>
<main>
	<section>
		<h2>Page loads</h2>
		<p class="hint">A new page load starts after every F5, crash or reopened tab.</p>
		<table id="sessions"><thead><tr><th>#</th><th>Started</th><th>Last event</th><th>Events</th><th>Problems</th></tr></thead><tbody></tbody></table>
	</section>
	<section>
		<h2>Likely problems <span id="problem-count" class="count"></span></h2>
		<ol id="problems"></ol>
	</section>
	<section>
		<h2>Timeline</h2>
		<p class="hint">Click a row for the full recorded data. Times are the recording machine's local time.</p>
		<div class="controls">
			<input id="search" type="search" placeholder="Filter text, e.g. INVITE, 401, pc#1">
			<select id="session"><option value="">All page loads</option></select>
			<label><input id="only-problems" type="checkbox"> Problems only</label>
		</div>
		<div id="channels" class="controls"></div>
		<p id="shown" class="hint"></p>
		<table id="timeline"><thead><tr><th>Time</th><th>Channel</th><th>Event</th></tr></thead><tbody></tbody></table>
		<button id="more" type="button" hidden>Show more</button>
	</section>
</main>
<script type="application/json" id="report-data">${embed(JSON.stringify(payload))}</script>
<script type="application/json" id="event-data">${embed(`[${records.map((r) => r.json).join(',')}]`)}</script>
<script>${SCRIPT}</script>
</body>
</html>
`;
}

const STYLE = `
:root { color-scheme: light dark; --bg: #fff; --fg: #1d1d1f; --muted: #6b6b70; --line: #e4e4e8; --soft: #f5f5f7; --bad: #c0362c; --bad-bg: #fdecea; --accent: #2a6fdb; }
@media (prefers-color-scheme: dark) { :root { --bg: #18181b; --fg: #ececf0; --muted: #9a9aa3; --line: #2e2e33; --soft: #222226; --bad: #ff7b6e; --bad-bg: #3a1f1c; --accent: #6ea2ff; } }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--fg); font: 14px/1.45 system-ui, -apple-system, "Segoe UI", sans-serif; }
header, main { max-width: 1280px; margin: 0 auto; padding: 16px; }
h1 { margin: 8px 0 12px; font-size: 22px; }
h2 { margin: 28px 0 6px; font-size: 17px; }
.hint { margin: 0 0 10px; color: var(--muted); font-size: 13px; }
.count { color: var(--bad); }
dl { display: grid; grid-template-columns: max-content 1fr; gap: 4px 16px; margin: 0; }
dt { color: var(--muted); }
dd { margin: 0; overflow-wrap: anywhere; }
table { width: 100%; border-collapse: collapse; }
th { text-align: left; font-weight: 600; color: var(--muted); border-bottom: 1px solid var(--line); padding: 6px 8px; position: sticky; top: 0; background: var(--bg); }
td { border-bottom: 1px solid var(--line); padding: 4px 8px; vertical-align: top; }
#timeline td:first-child, #sessions td, .mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12.5px; white-space: nowrap; }
#timeline td:last-child { overflow-wrap: anywhere; }
#timeline tbody tr.row { cursor: pointer; }
#timeline tbody tr.row:hover { background: var(--soft); }
tr.problem td { background: var(--bad-bg); }
tr.problem td:last-child { color: var(--bad); }
tr.session-start td { border-top: 2px solid var(--accent); }
.ch { display: inline-block; min-width: 64px; padding: 0 6px; border-radius: 4px; background: var(--soft); font-size: 12px; }
pre.raw { margin-top: 6px; }
pre { margin: 0;padding: 10px; background: var(--soft); border-radius: 6px; overflow: auto; max-height: 420px; font-size: 12px; white-space: pre-wrap; overflow-wrap: anywhere; }
.controls { display: flex; flex-wrap: wrap; gap: 8px 14px; align-items: center; margin-bottom: 8px; }
.controls label { display: inline-flex; gap: 4px; align-items: center; }
input[type=search], select { font: inherit; padding: 5px 8px; border: 1px solid var(--line); border-radius: 6px; background: var(--bg); color: var(--fg); }
input[type=search] { flex: 1 1 260px; }
#problems { padding-left: 22px; margin: 0; }
#problems li { margin: 2px 0; }
#problems a { color: var(--bad); text-decoration: none; overflow-wrap: anywhere; }
#problems a:hover { text-decoration: underline; }
button { font: inherit; margin: 12px 0; padding: 6px 14px; border-radius: 6px; border: 1px solid var(--line); background: var(--soft); color: var(--fg); cursor: pointer; }
@media (max-width: 640px) { #timeline td:first-child { white-space: normal; } dl { grid-template-columns: 1fr; } }
`;

const SCRIPT = `
(() => {
	const data = JSON.parse(document.getElementById('report-data').textContent);
	let events = null;
	const eventAt = (i) => {
		if (!events) events = JSON.parse(document.getElementById('event-data').textContent);
		return events[i];
	};
	const el = (tag, text, cls) => {
		const node = document.createElement(tag);
		if (text !== undefined) node.textContent = String(text);
		if (cls) node.className = cls;
		return node;
	};

	const m = data.meta;
	const metaRows = [
		['App', m.app], ['Recorder', m.recorder], ['Recorded', m.span], ['Time zone', m.timezone],
		['Events', m.records], ['Origin', m.origin], ['Browser', m.userAgent], ['Exported', m.generatedAt],
	];
	const dl = document.getElementById('meta');
	for (const [k, v] of metaRows) { dl.append(el('dt', k), el('dd', v)); }

	const sessionBody = document.querySelector('#sessions tbody');
	const sessionSelect = document.getElementById('session');
	for (const s of data.sessions) {
		const tr = el('tr');
		tr.append(el('td', s.no), el('td', s.start), el('td', s.end), el('td', s.events), el('td', s.problems || ''));
		sessionBody.append(tr);
		sessionSelect.append(el('option', 'Page load ' + s.no + ' · ' + s.start));
		sessionSelect.lastChild.value = String(s.no);
	}

	const problems = data.rows.filter((r) => r[5]);
	document.getElementById('problem-count').textContent = problems.length ? '(' + problems.length + ')' : '';
	const problemList = document.getElementById('problems');
	if (!problems.length) problemList.replaceWith(el('p', 'None found.', 'hint'));
	for (const r of problems.slice(0, 200)) {
		const li = el('li');
		const a = el('a', r[0] + '  ' + r[2] + '  ' + r[4]);
		a.href = '#';
		a.addEventListener('click', (e) => { e.preventDefault(); reveal(r[6]); });
		li.append(a);
		problemList.append(li);
	}

	const counts = {};
	for (const r of data.rows) counts[r[2]] = (counts[r[2]] || 0) + 1;
	const channelBox = document.getElementById('channels');
	const enabled = new Set(Object.keys(counts));
	for (const ch of Object.keys(counts).sort()) {
		const label = el('label');
		const box = el('input');
		box.type = 'checkbox';
		box.checked = true;
		box.addEventListener('change', () => { box.checked ? enabled.add(ch) : enabled.delete(ch); render(); });
		label.append(box, el('span', ch + ' (' + counts[ch] + ')'));
		channelBox.append(label);
	}

	const PAGE = 1000;
	let limit = PAGE;
	let pinned = null;
	const search = document.getElementById('search');
	const onlyProblems = document.getElementById('only-problems');
	const body = document.querySelector('#timeline tbody');
	const more = document.getElementById('more');
	const shown = document.getElementById('shown');

	const matches = () => {
		const q = search.value.trim().toLowerCase();
		const session = sessionSelect.value;
		return data.rows.filter((r) =>
			r[6] === pinned || (
				enabled.has(r[2]) &&
				(!onlyProblems.checked || r[5]) &&
				(!session || String(r[1]) === session) &&
				(!q || (r[4] + ' ' + r[3] + ' ' + r[2]).toLowerCase().includes(q))
			));
	};

	const toggleDetail = (tr, index) => {
		const next = tr.nextElementSibling;
		if (next && next.classList.contains('detail')) { next.remove(); return; }
		const detail = el('tr', undefined, 'detail');
		const td = el('td');
		td.colSpan = 3;
		const event = eventAt(index);
		const text = event && event.data && typeof event.data.text === 'string' && event.data.text.includes('\\n') ? event.data.text : null;
		const shown = text ? { ...event, data: { ...event.data, text: '(message below)' } } : event;
		td.append(el('pre', JSON.stringify(shown, null, 2)));
		if (text) td.append(el('pre', text, 'raw'));
		detail.append(td);
		tr.after(detail);
	};

	function render() {
		const list = matches();
		body.replaceChildren();
		let session = 0;
		for (const r of list.slice(0, limit)) {
			const tr = el('tr', undefined, 'row' + (r[5] ? ' problem' : '') + (r[1] !== session && session ? ' session-start' : ''));
			session = r[1];
			tr.dataset.index = r[6];
			const chCell = el('td');
			chCell.append(el('span', r[2], 'ch'));
			tr.append(el('td', r[0]), chCell, el('td', r[4]));
			tr.title = r[3] + ' · page load ' + r[1];
			tr.addEventListener('click', () => toggleDetail(tr, r[6]));
			body.append(tr);
		}
		shown.textContent = 'Showing ' + Math.min(limit, list.length) + ' of ' + list.length + ' matching events (' + data.rows.length + ' total).';
		more.hidden = list.length <= limit;
	}

	function reveal(index) {
		pinned = index;
		const list = matches();
		const pos = list.findIndex((r) => r[6] === index);
		if (pos >= limit) limit = Math.ceil((pos + 1) / PAGE) * PAGE;
		render();
		const tr = body.querySelector('tr[data-index="' + index + '"]');
		if (!tr) return;
		tr.scrollIntoView({ block: 'center' });
		if (!tr.nextElementSibling || !tr.nextElementSibling.classList.contains('detail')) toggleDetail(tr, index);
	}

	let timer = null;
	search.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { limit = PAGE; pinned = null; render(); }, 150); });
	for (const control of [sessionSelect, onlyProblems]) control.addEventListener('change', () => { limit = PAGE; pinned = null; render(); });
	more.addEventListener('click', () => { limit += PAGE; render(); });
	render();
})();
`;
