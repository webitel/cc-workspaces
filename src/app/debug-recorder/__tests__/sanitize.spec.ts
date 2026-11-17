import { describe, expect, it } from 'vitest';
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
