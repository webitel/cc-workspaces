import { MAX_TEXT_CHARS } from './config';

export const REDACTED = '[REDACTED]';

/** keys whose values are secrets: dropped entirely */
const SECRET_KEY_RE =
	/pass(word|wd)?$|^pwd$|secret|token|authori[sz]ation|credential|api[-_]?key|cookie|^ha1$|^x-webitel-access$|^access$/i;

/** keys whose values are personal data: masked, last chars kept for correlation */
const PII_KEY_RE =
	/(^|_)(number|phone|destination|email|display|msisdn|display_?name|full_?name|first_?name|last_?name|caller_?name)$|^(phone|email)/i;
// camelCase variants (`fromNumber`), case-sensitive on purpose
const PII_CAMEL_KEY_RE =
	/[a-z](Number|Phone|Email|Destination|DisplayName|FullName|FirstName|LastName)$/;
// `name` is PII only inside a party object (`from.name`), not for queues or agents
const PARTY_KEY_RE =
	/^(from|to|members?|contacts?|customers?|clients?|callers?|callees?|participants?|peers?|parties|party)$/i;
const PARTY_NAME_KEY_RE = /^name$/i;
// arbitrary data attached to a call or form: keep the keys, drop the values
const FREE_DATA_KEY_RE = /^(variables|vars|custom_?data|form_?data)$/i;

/** chat message bodies: replaced by their length */
const CONTENT_KEY_RE = /^text$/i;

/** query params that are secrets although the key rule does not match them */
const SECRET_PARAM_RE = /^(key|auth|sig|signature)$/i;

// fail-closed: a value/token whose decoded form still holds `<secret>=` is replaced whole
const PARAM_RE = /([?&#;])([^=?&#;\s"'<>]+)=([^&#;\s"'<>]*)/g;
// lookbehind keeps the delimiter, so `a=token=x` still yields `token`
const PAIR_NAME_RE =
	/(?<=^|[?&#;,\s{(=/:])([^=?&#;,\s"'<>{}()/:]+)=(?!\[REDACTED\])/g;
const TEXT_TOKEN_RE = /[^\s"'<>]+/g;
// prose `name: value`: only the separator is searched, the name is read backwards (linear)
const PROSE_SEPARATOR_RE = /[:=]/g;
const MAX_GAP_CHARS = 64;
const NAME_CHAR_RE = /[\w.-]/;
const MAX_NAME_CHARS = 64;
const VALUE_STOP_RE = /[\s,;"'&<>]/;
const JSON_STRING_PAIR_RE = /("((?:[^"\\]|\\.)*)"\s*:\s*)"(?:[^"\\]|\\.)*"/g;
const MAX_DECODE_PASSES = 5;

const SIP_AUTH_HEADER_RE = /^((?:Proxy-)?Authorization)[ \t]*:.*$/gim;
const BEARER_RE = /(Bearer\s+)[A-Za-z0-9\-._~+/]+=*/gi;

const isSecretKey = (key: string) => SECRET_KEY_RE.test(key);
const isSecretName = (name: string) =>
	isSecretKey(name) || SECRET_PARAM_RE.test(name);

/** decodes each %XX on its own: a malformed escape elsewhere cannot block decoding */
function decodeOnce(value: string): string {
	return value.replace(/%[0-9A-Fa-f]{2}/g, (sequence) => {
		try {
			return decodeURIComponent(sequence);
		} catch {
			return sequence;
		}
	});
}

/** every decoded form of `value`, raw first; null if it still changes after the pass limit */
function decodedForms(value: string): string[] | null {
	const forms = [
		value,
	];
	let current = value;
	for (let pass = 0; pass < MAX_DECODE_PASSES; pass += 1) {
		const next = decodeOnce(current);
		if (next === current) return forms;
		forms.push(next);
		current = next;
	}
	return decodeOnce(current) === current ? forms : null;
}

/** true if `value`, or any percent-decoded form of it, contains `<secret-name>=` */
export function containsSecretPair(value: string): boolean {
	if (!value.includes('=') && !value.includes('%')) return false;
	const forms = decodedForms(value);
	if (!forms) return true;
	return forms.some((form) =>
		Array.from(form.matchAll(PAIR_NAME_RE)).some(([, name]) =>
			isSecretName(name),
		),
	);
}

function isSecretParam(rawName: string): boolean {
	const forms = decodedForms(rawName);
	return !forms || forms.some(isSecretName);
}

function redactParams(text: string): string {
	return text.replace(
		PARAM_RE,
		(match, delimiter: string, name: string, value: string) =>
			isSecretParam(name) || containsSecretPair(value)
				? `${delimiter}${name}=${REDACTED}`
				: match,
	);
}

// end of the value at `start`; an unterminated quote fails closed to the end of the (truncated) text
function valueEnd(text: string, start: number): number {
	const quote = text[start];
	if (quote === '"' || quote === "'") {
		for (let i = start + 1; i < text.length; i += 1) {
			if (text[i] === '\\') i += 1;
			else if (text[i] === quote) return i + 1;
		}
		return text.length;
	}
	let i = start;
	while (i < text.length && !VALUE_STOP_RE.test(text[i])) i += 1;
	return i;
}

function nameBefore(text: string, end: number): string {
	let start = end;
	while (
		start > 0 &&
		end - start < MAX_NAME_CHARS &&
		NAME_CHAR_RE.test(text[start - 1])
	) {
		start -= 1;
	}
	return text.slice(start, end);
}

/** `password: x`, `token="x"`, `'apiKey':\n 'x'` in free text, for any secret-looking name */
function redactProse(text: string): string {
	const separatorRe = new RegExp(PROSE_SEPARATOR_RE.source, 'g');
	let out = '';
	let last = 0;
	for (let m = separatorRe.exec(text); m; m = separatorRe.exec(text)) {
		// `name "  :` — step back over blanks and one closing quote, bounded
		let nameEnd = m.index;
		const gapLimit = Math.max(0, m.index - MAX_GAP_CHARS);
		while (nameEnd > gapLimit && /[ \t]/.test(text[nameEnd - 1])) nameEnd -= 1;
		if (nameEnd > 0 && /["']/.test(text[nameEnd - 1])) nameEnd -= 1;
		const name = nameBefore(text, nameEnd);
		if (!name || !isSecretParam(name)) continue;

		// the value may follow on the next line
		let start = m.index + 1;
		while (start < text.length && /\s/.test(text[start])) start += 1;
		if (start >= text.length || text.startsWith(REDACTED, start)) continue;
		let end = valueEnd(text, start);
		// value starts with a stop char (`password=,abc`, `token=<x>`): fail closed to the next blank
		if (end === start) {
			while (end < text.length && !/\s/.test(text[end])) end += 1;
		}
		out += `${text.slice(last, start)}${REDACTED}`;
		last = end;
		separatorRe.lastIndex = end;
	}
	return out + text.slice(last);
}

/** backstop: a whitespace/quote-delimited token that still decodes to a secret pair goes whole */
function redactTokens(text: string): string {
	return text.replace(TEXT_TOKEN_RE, (token) =>
		containsSecretPair(token) ? REDACTED : token,
	);
}

// not preceded by a word char or `sip:`, so SIP URIs keep their user part
const EMAIL_RE =
	/(?<![\w.%+-]|sips?:)[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,})/g;
// 9+ digits: external numbers; internal extensions (3-6 digits) stay readable
const PHONE_RE = /(?<![\w.])\+?\d{9,15}(?![\w.])/g;

export function maskPii(value: string): string {
	if (value.includes('@')) {
		return `***@${value.split('@').pop()}`;
	}
	return value.length > 4 ? `***${value.slice(-3)}` : '***';
}

export function truncate(text: string, max = MAX_TEXT_CHARS): string {
	return text.length > max
		? `${text.slice(0, max)}…[+${text.length - max} chars]`
		: text;
}

export interface RedactTextOptions {
	/** mask long digit runs: only for SIP, where numbers are dialled numbers */
	phones?: boolean;
}

export function redactText(text: string, opts: RedactTextOptions = {}): string {
	// cut first: every pass below then works on a bounded input
	let out = truncate(text)
		.replace(SIP_AUTH_HEADER_RE, `$1: ${REDACTED}`)
		.replace(BEARER_RE, `$1${REDACTED}`)
		.replace(JSON_STRING_PAIR_RE, (match, prefix: string, key: string) =>
			isSecretKey(key) ? `${prefix}"${REDACTED}"` : match,
		);
	out = redactTokens(redactParams(redactProse(out))).replace(
		EMAIL_RE,
		'***@$1',
	);
	if (opts.phones) {
		out = out.replace(PHONE_RE, (m) => maskPii(m));
	}
	return out;
}

export function redactUrl(url: string): string {
	const out = redactParams(url);
	return containsSecretPair(out) ? REDACTED : out;
}

export interface SanitizeOptions extends RedactTextOptions {
	maxDepth?: number;
	maxKeys?: number;
	maxText?: number;
}

function describeNode(node: Node): string {
	if (typeof Element !== 'undefined' && node instanceof Element) {
		const id = node.id ? `#${node.id}` : '';
		const cls =
			typeof node.className === 'string' && node.className
				? `.${node.className.trim().split(/\s+/).slice(0, 3).join('.')}`
				: '';
		return `<${node.tagName.toLowerCase()}${id}${cls}>`;
	}
	return `[${node.nodeName}]`;
}

// any value -> JSON-safe plain value with secrets removed and PII masked (cycles, DOM, errors, Vue proxies)
export function sanitize(value: unknown, opts: SanitizeOptions = {}): unknown {
	const maxDepth = opts.maxDepth ?? 6;
	const maxKeys = opts.maxKeys ?? 100;
	const maxText = opts.maxText ?? MAX_TEXT_CHARS;
	const seen = new WeakSet<object>();

	const walk = (v: unknown, depth: number, parentKey = ''): unknown => {
		if (v === null || v === undefined) return v;
		switch (typeof v) {
			case 'string':
				return truncate(redactText(v, opts), maxText);
			case 'number':
			case 'boolean':
				return v;
			case 'bigint':
				return `${v}n`;
			case 'symbol':
				return v.toString();
			case 'function':
				return `[Function ${
					(
						v as {
							name?: string;
						}
					).name || 'anonymous'
				}]`;
		}

		let obj = v as object;
		// Vue reactive proxy: read the raw target (untracked), so logging inside a
		// render/computed does not subscribe it to every field of the logged object
		for (
			let raw = (
				obj as {
					__v_raw?: unknown;
				}
			).__v_raw;
			raw && typeof raw === 'object' && raw !== obj;
			raw = (
				obj as {
					__v_raw?: unknown;
				}
			).__v_raw
		) {
			obj = raw;
		}
		if (obj instanceof Error) {
			return {
				name: obj.name,
				message: walk(obj.message, depth + 1),
				stack: obj.stack ? truncate(redactText(obj.stack), maxText) : undefined,
				cause: obj.cause === undefined ? undefined : walk(obj.cause, depth + 1),
			};
		}
		if (typeof Node !== 'undefined' && obj instanceof Node) {
			return describeNode(obj);
		}
		if (typeof Event !== 'undefined' && obj instanceof Event) {
			const target = obj.target;
			return {
				event: obj.type,
				target:
					typeof Node !== 'undefined' && target instanceof Node
						? describeNode(target)
						: undefined,
			};
		}
		if (obj instanceof ArrayBuffer) return `[ArrayBuffer ${obj.byteLength}]`;
		if (ArrayBuffer.isView(obj))
			return `[${obj.constructor.name} ${obj.byteLength}]`;
		if (typeof Blob !== 'undefined' && obj instanceof Blob)
			return `[Blob ${obj.size}]`;
		if (obj instanceof Date) return obj.toISOString();
		if (obj instanceof RegExp) return obj.toString();

		if (seen.has(obj)) return '[Circular]';
		if (depth >= maxDepth) return Array.isArray(obj) ? '[Array]' : '[Object]';
		seen.add(obj);

		if (Array.isArray(obj) || obj instanceof Set) {
			const items = Array.from(obj as Iterable<unknown>);
			// elements inherit the array's key, so `members: [{name}]` is still a party
			const out = items
				.slice(0, maxKeys)
				.map((item) => walk(item, depth + 1, parentKey));
			if (items.length > maxKeys)
				out.push(`…[+${items.length - maxKeys} items]`);
			return out;
		}

		const entries: [
			string,
			unknown,
		][] =
			obj instanceof Map
				? Array.from(obj.entries()).map(([k, val]) => [
						String(k),
						val,
					])
				: Object.keys(obj).map((k) => {
						try {
							return [
								k,
								(obj as Record<string, unknown>)[k],
							];
						} catch (err) {
							return [
								k,
								`[Throws: ${(err as Error)?.message}]`,
							];
						}
					});

		const out: Record<string, unknown> = {};
		const isParty = PARTY_KEY_RE.test(parentKey);
		for (const [key, val] of entries.slice(0, maxKeys)) {
			if (isSecretKey(key)) {
				out[key] =
					val === undefined || val === null || val === '' ? val : REDACTED;
			} else if (
				CONTENT_KEY_RE.test(key) &&
				typeof val === 'string' &&
				val.length
			) {
				out[key] = `[text: ${val.length} chars]`;
			} else if (
				(PII_KEY_RE.test(key) ||
					PII_CAMEL_KEY_RE.test(key) ||
					(isParty && PARTY_NAME_KEY_RE.test(key))) &&
				(typeof val === 'string' || typeof val === 'number') &&
				String(val).length
			) {
				out[key] = maskPii(String(val));
			} else if (
				FREE_DATA_KEY_RE.test(key) &&
				val !== null &&
				typeof val === 'object'
			) {
				out[key] = Object.fromEntries(
					Object.keys(val)
						.slice(0, maxKeys)
						.map((k) => [
							k,
							`[value: ${String((val as Record<string, unknown>)[k] ?? '').length} chars]`,
						]),
				);
			} else {
				out[key] = walk(val, depth + 1, key);
			}
		}
		if (entries.length > maxKeys) {
			out['…'] = `+${entries.length - maxKeys} keys`;
		}
		return out;
	};

	try {
		return walk(value, 0);
	} catch (err) {
		return `[Unserializable: ${(err as Error)?.message}]`;
	}
}

/** RTCConfiguration without TURN credentials */
export function sanitizeRtcConfig(config?: RTCConfiguration): unknown {
	if (!config) return config;
	return {
		...(sanitize(config, {
			maxDepth: 4,
		}) as object),
		iceServers: config.iceServers?.map((server) => ({
			urls: server.urls,
			username: server.username ? REDACTED : undefined,
			credential: server.credential ? REDACTED : undefined,
		})),
	};
}
