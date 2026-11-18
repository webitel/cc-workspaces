import { describe, expect, it, vi } from 'vitest';
import { effect, reactive } from 'vue';
import {
	REDACTED,
	redactText,
	redactUrl,
	sanitize,
	sanitizeRtcConfig,
} from '../sanitize';

describe('redactUrl', () => {
	it('removes the access token from the query, keeps other params', () => {
		expect(
			redactUrl('https://x.webitel.me/workspace?accessToken=abc.def&tab=calls'),
		).toBe(`https://x.webitel.me/workspace?accessToken=${REDACTED}&tab=calls`);
		expect(redactUrl('/api/ws?access_token=zzz')).toBe(
			`/api/ws?access_token=${REDACTED}`,
		);
	});
});

describe('redactText', () => {
	const register = [
		'REGISTER sip:webitel.me SIP/2.0',
		'Via: SIP/2.0/WSS abc.invalid;branch=z9hG4bK1',
		'From: <sip:1001@webitel.me>;tag=1',
		'To: <sip:380671234567@webitel.me>',
		'Authorization: Digest username="1001", realm="webitel.me", nonce="n", response="deadbeef"',
		'Proxy-Authorization: Digest username="1001", response="cafe"',
		'Call-ID: 3k2j4h5g',
		'',
		'',
	].join('\r\n');

	it('drops SIP Authorization and Proxy-Authorization header values', () => {
		const out = redactText(register);
		expect(out).toContain(`Authorization: ${REDACTED}`);
		expect(out).toContain(`Proxy-Authorization: ${REDACTED}`);
		expect(out).not.toContain('deadbeef');
		expect(out).not.toContain('cafe');
	});

	it('masks external numbers only when asked, keeps extensions and SIP user parts', () => {
		expect(redactText(register)).toContain('380671234567');
		const out = redactText(register, {
			phones: true,
		});
		expect(out).not.toContain('380671234567');
		expect(out).toContain('sip:***567@webitel.me');
		expect(out).toContain('sip:1001@webitel.me');
	});

	it('removes bearer tokens and JSON secrets embedded in strings', () => {
		const out = redactText(
			'sent Bearer eyJhbGciOi.payload.sig {"password":"p@ss\\"w","name":"x"}',
		);
		expect(out).not.toContain('eyJhbGciOi');
		expect(out).not.toContain('p@ss');
		expect(out).toContain('"name":"x"');
	});

	it('applies the same key rule inside strings as for object keys', () => {
		const out = redactText(
			'{"sipPassword":"a1","client_secret":"b2","ha1":"c3","Cookie":"d4","X-Webitel-Access":"e5","queue":"Support"}',
		);
		for (const leaked of [
			'a1',
			'b2',
			'c3',
			'd4',
			'e5',
		]) {
			expect(out).not.toContain(`"${leaked}"`);
		}
		expect(out).toContain('"queue":"Support"');
	});

	it('removes any secret-looking query param, keeps the rest', () => {
		expect(redactUrl('/x?refresh_token=r&sig=s&apiKey=k&page=2#auth=h')).toBe(
			`/x?refresh_token=${REDACTED}&sig=${REDACTED}&apiKey=${REDACTED}&page=2#auth=${REDACTED}`,
		);
	});

	it('fails closed on a URL nested inside another param, plain or encoded', () => {
		expect(redactUrl('/login?next=/cb?access_token=x&page=2')).toBe(
			`/login?next=${REDACTED}&page=2`,
		);
		expect(
			redactUrl('/login?next=%2Fcb%3Faccess_token%3Dabc%26page%3D2&lang=uk'),
		).toBe(`/login?next=${REDACTED}&lang=uk`);
		expect(redactUrl('/x?next=%252Fcb%253Ftoken%253Dzz')).toBe(
			`/x?next=${REDACTED}`,
		);
		expect(redactUrl('/x?state=access_token%3Dqq')).toBe(
			`/x?state=${REDACTED}`,
		);
	});

	it('cuts a secret value whole, even with encoded delimiters inside', () => {
		expect(redactUrl('/x?token=abc%26def%3Fghi&page=2')).toBe(
			`/x?token=${REDACTED}&page=2`,
		);
	});

	it('decodes the param name before checking it', () => {
		expect(redactUrl('/x?access%5Ftoken=abc&pass%77ord=p')).toBe(
			`/x?access%5Ftoken=${REDACTED}&pass%77ord=${REDACTED}`,
		);
	});

	it('is not fooled by a malformed escape next to an encoded secret', () => {
		expect(redactUrl('/x?next=%ZZ%2Fcb%3Ftoken%3Dabc')).not.toContain('abc');
		expect(redactUrl('/x?next=%E0%A4%A%2Fcb%3Ftoken%3Dabc')).not.toContain(
			'abc',
		);
	});

	it('fails closed when the value keeps decoding past the pass limit', () => {
		let nested = 'token=abc';
		for (let i = 0; i < 8; i += 1) nested = encodeURIComponent(nested);
		expect(redactUrl(`/x?next=${nested}`)).toBe(`/x?next=${REDACTED}`);
	});

	it('catches pairs with encoded delimiters at the top level and in free text', () => {
		expect(redactUrl('/x%3Faccess_token%3Dabc')).not.toContain('abc');
		const out = redactText(
			'retry with access_token%3Dabc; auth failed token=def, password: ghi',
		);
		for (const leaked of [
			'abc',
			'def',
			'ghi',
		]) {
			expect(out).not.toContain(leaked);
		}
		expect(out).toContain('retry with');
	});

	it('finds a secret pair inside the value of a non-secret one', () => {
		for (const input of [
			'x: token: v1',
			`msg: 'password: v1'`,
			'note="pwd=v1 retry"',
		]) {
			expect(redactText(input)).not.toContain('v1');
		}
	});

	it('fails closed on an unterminated quoted secret, to the end of the text', () => {
		const out = redactText('password="abc def\nnext line');
		expect(out).toBe(`password=${REDACTED}`);
	});

	it('cuts a long quoted secret up to its real closing quote, across lines', () => {
		const value = `${'a'.repeat(5_000)}\nsecret-tail`;
		const out = redactText(`token="${value}" after`);
		expect(out).toBe(`token=${REDACTED} after`);
	});

	it('finds a value that starts on the next line', () => {
		const out = redactText('password:\n\n   hunter2\nnext');
		expect(out).not.toContain('hunter2');
		expect(out).toContain('next');
	});

	it('checks the end of a name longer than the scan window', () => {
		const out = redactText(`${'x_'.repeat(50)}password: v1 ok`);
		expect(out).not.toContain('v1');
		expect(out).toContain('ok');
	});

	it('stays fast on adversarial input', () => {
		const inputs = [
			'a: '.repeat(20_000),
			`${'a'.repeat(60)}=`.repeat(2_000),
			`password="${'x\\'.repeat(20_000)}`,
			'"'.repeat(50_000),
			' '.repeat(20_000),
			'\t'.repeat(20_000),
			`${' '.repeat(15_000)}x`,
			`password:${' '.repeat(15_000)}`,
		];
		const started = performance.now();
		for (const input of inputs) redactText(input);
		expect(performance.now() - started).toBeLessThan(500);
	});

	it('fails closed when a secret value starts with a punctuation char', () => {
		for (const input of [
			'password=,hunter2 ok',
			'token=<abc> ok',
			'pwd:;s3cr3t ok',
		]) {
			const out = redactText(input);
			expect(out).not.toMatch(/hunter2|abc|s3cr3t/);
			expect(out).toContain('ok');
		}
	});

	it('redacts quoted and unquoted values after any secret-looking name in text', () => {
		const out = redactText(
			`password="hunter 2" token: 'abc' {'apiKey': "k1"} credentials=c1 cookie: sid=c2; ha1=h1 sig=s1 user=ivan`,
		);
		for (const leaked of [
			'hunter',
			'abc',
			'k1',
			'c1',
			'c2',
			'h1',
			's1',
		]) {
			expect(out).not.toContain(leaked);
		}
		expect(out).toContain('user=ivan');
	});

	it('leaves ordinary URLs and SIP params alone', () => {
		const url = '/api/agents?page=2&size=10&q=x%20y#tab';
		expect(redactUrl(url)).toBe(url);
		const via = 'Via: SIP/2.0/WSS a.invalid;branch=z9hG4bK1;transport=ws';
		expect(redactText(via)).toBe(via);
	});

	it('masks e-mails but not SIP URIs', () => {
		const out = redactText(
			'mail john.doe@example.com, call sip:1001@pbx.local.com',
		);
		expect(out).toContain('***@example.com');
		expect(out).not.toContain('john.doe');
		expect(out).toContain('sip:1001@pbx.local.com');
	});
});

describe('sanitize', () => {
	it('reads Vue reactive objects raw, without subscribing the running effect', () => {
		const state = reactive({
			agent: {
				status: 'online',
			},
		});
		const runs = vi.fn();
		effect(() => {
			runs();
			sanitize(state);
		});
		state.agent.status = 'pause';
		expect(runs).toHaveBeenCalledTimes(1);
		expect(sanitize(state)).toEqual({
			agent: {
				status: 'pause',
			},
		});
	});

	it('masks names of parties listed in arrays', () => {
		expect(
			sanitize({
				members: [
					{
						name: 'Ivan Petrenko',
					},
				],
				participants: [
					{
						name: 'Olha Koval',
					},
				],
				queues: [
					{
						name: 'Support',
					},
				],
			}),
		).toEqual({
			members: [
				{
					name: '***nko',
				},
			],
			participants: [
				{
					name: '***val',
				},
			],
			queues: [
				{
					name: 'Support',
				},
			],
		});
	});

	it('masks party names and drops call variable values, keeps queue and agent names', () => {
		expect(
			sanitize({
				from: {
					name: 'Ivan Petrenko',
					number: '380671234567',
				},
				queue: {
					name: 'Support',
				},
				agent: {
					name: 'Olena',
				},
				display_name: 'Ivan P',
				variables: {
					card: '4111111111111111',
					lang: 'uk',
				},
			}),
		).toEqual({
			from: {
				name: '***nko',
				number: '***567',
			},
			queue: {
				name: 'Support',
			},
			agent: {
				name: 'Olena',
			},
			display_name: '***n P',
			variables: {
				card: '[value: 16 chars]',
				lang: '[value: 2 chars]',
			},
		});
	});

	it('redacts secret keys at any depth and masks PII keys', () => {
		const out = sanitize({
			user: {
				password: 'hunter2',
				sip_password: 'x',
				accessToken: 't',
				'X-Webitel-Access': 'w',
			},
			call: {
				from_number: '380671234567',
				destinationNumber: '0501112233',
				queue: {
					name: 'Support',
				},
			},
			message: {
				text: 'my card is 4111',
			},
		});
		expect(out).toEqual({
			user: {
				password: REDACTED,
				sip_password: REDACTED,
				accessToken: REDACTED,
				'X-Webitel-Access': REDACTED,
			},
			call: {
				from_number: '***567',
				destinationNumber: '***233',
				queue: {
					name: 'Support',
				},
			},
			message: {
				text: '[text: 15 chars]',
			},
		});
	});

	it('survives cycles, errors and DOM nodes', () => {
		const loop: Record<string, unknown> = {
			a: 1,
		};
		loop.self = loop;
		const el = document.createElement('button');
		el.id = 'call';
		const out = sanitize({
			loop,
			el,
			err: new TypeError('boom'),
		}) as Record<string, Record<string, unknown>>;
		expect(out.loop.self).toBe('[Circular]');
		expect(out.el).toBe('<button#call>');
		expect(out.err.name).toBe('TypeError');
		expect(out.err.message).toBe('boom');
	});

	it('cuts long strings and deep objects', () => {
		const out = sanitize(
			{
				s: 'x'.repeat(50),
				deep: {
					a: {
						b: {
							c: 1,
						},
					},
				},
			},
			{
				maxText: 10,
				maxDepth: 2,
			},
		) as Record<string, unknown>;
		expect(out.s).toBe('xxxxxxxxxx…[+40 chars]');
		expect(out.deep).toEqual({
			a: '[Object]',
		});
	});
});

describe('sanitizeRtcConfig', () => {
	it('keeps TURN urls, drops credentials', () => {
		expect(
			sanitizeRtcConfig({
				iceServers: [
					{
						urls: 'turn:turn.webitel.me:3478',
						username: 'u',
						credential: 'c',
					},
				],
			}),
		).toEqual({
			iceServers: [
				{
					urls: 'turn:turn.webitel.me:3478',
					username: REDACTED,
					credential: REDACTED,
				},
			],
		});
	});
});
