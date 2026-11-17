import { MAX_TEXT_CHARS } from './config';

export const REDACTED = '[REDACTED]';

/** keys whose values are secrets: dropped entirely */
const SECRET_KEY_RE =
	/pass(word|wd)?$|secret|token|authori[sz]ation|credential|api[-_]?key|cookie|^ha1$|^x-webitel-access$|^access$/i;

/** keys whose values are personal data: masked, last chars kept for correlation */
const PII_KEY_RE =
	/(^|_)(number|phone|destination|email|display|msisdn)$|^(phone|email)/i;
// camelCase variants (`fromNumber`), case-sensitive on purpose
const PII_CAMEL_KEY_RE = /[a-z](Number|Phone|Email|Destination)$/;

/** chat message bodies: replaced by their length */
const CONTENT_KEY_RE = /^text$/i;

/** query params that are secrets although the key rule does not match them */
const SECRET_PARAM_RE = /^(key|auth|sig|signature)$/i;

// every query param and every quoted JSON key inside strings is checked against
// SECRET_KEY_RE, so object keys and in-string keys follow one rule
const QUERY_PARAM_RE = /([?&#]([^=&#\s"'<>]+)=)([^&#\s"'<>]*)/g;
const JSON_STRING_PAIR_RE = /("((?:[^"\\]|\\.)*)"\s*:\s*)"(?:[^"\\]|\\.)*"/g;

const SIP_AUTH_HEADER_RE = /^((?:Proxy-)?Authorization)[ \t]*:.*$/gim;
const BEARER_RE = /(Bearer\s+)[A-Za-z0-9\-._~+/]+=*/gi;

const isSecretKey = (key: string) => SECRET_KEY_RE.test(key);

function redactQuery(text: string): string {
	return text.replace(QUERY_PARAM_RE, (match, prefix: string, name: string) =>
		isSecretKey(name) || SECRET_PARAM_RE.test(name)
			? `${prefix}${REDACTED}`
			: match,
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
	let out = redactQuery(
		text
			.replace(SIP_AUTH_HEADER_RE, `$1: ${REDACTED}`)
			.replace(BEARER_RE, `$1${REDACTED}`)
			.replace(JSON_STRING_PAIR_RE, (match, prefix: string, key: string) =>
				isSecretKey(key) ? `${prefix}"${REDACTED}"` : match,
			),
	).replace(EMAIL_RE, '***@$1');
	if (opts.phones) {
		out = out.replace(PHONE_RE, (m) => maskPii(m));
	}
	return out;
}

export function redactUrl(url: string): string {
	return redactQuery(url);
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

/**
 * Turns any value into a structured-cloneable, JSON-safe plain value with
 * secrets removed and PII masked. Handles cycles, DOM nodes, errors, Vue proxies.
 */
export function sanitize(value: unknown, opts: SanitizeOptions = {}): unknown {
	const maxDepth = opts.maxDepth ?? 6;
	const maxKeys = opts.maxKeys ?? 100;
	const maxText = opts.maxText ?? MAX_TEXT_CHARS;
	const seen = new WeakSet<object>();

	const walk = (v: unknown, depth: number): unknown => {
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

		const obj = v as object;
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
			const out = items.slice(0, maxKeys).map((item) => walk(item, depth + 1));
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
				(PII_KEY_RE.test(key) || PII_CAMEL_KEY_RE.test(key)) &&
				(typeof val === 'string' || typeof val === 'number') &&
				String(val).length
			) {
				out[key] = maskPii(String(val));
			} else {
				out[key] = walk(val, depth + 1);
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
