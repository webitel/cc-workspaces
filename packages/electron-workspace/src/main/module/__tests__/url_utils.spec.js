import { describe, expect, it } from 'vitest';

import { isWebUrl, originOf } from '../url_utils';

describe('isWebUrl', () => {
	it.each([
		'https://example.test/workspace',
		'http://example.test/workspace',
		'http://example.test:8080/workspace',
	])('allows %s', (url) => {
		expect(isWebUrl(url)).toBe(true);
	});

	it.each([
		'smb://attacker.test/share',
		'file:///etc/passwd',
		'ms-settings://x',
		'javascript:alert(1)',
		'wtel:test;x=1',
		'//example.test/workspace',
		'',
		undefined,
	])('refuses %s', (url) => {
		expect(isWebUrl(url)).toBe(false);
	});
});

describe('originOf', () => {
	it('returns the origin of a web url', () => {
		expect(originOf('https://example.test/a/b?c=1')).toBe(
			'https://example.test',
		);
	});

	it.each([
		'smb://attacker.test/share',
		'wtel:test',
		'file:///etc/passwd',
		'not a url',
		'',
		undefined,
	])('returns null for %s', (url) => {
		// a non-special scheme has an opaque origin, which the URL API reports
		// as the string 'null'; returning it would make two unrelated URLs
		// compare equal in the navigation guard
		expect(originOf(url)).toBeNull();
	});

	it('never reports two opaque urls as the same origin', () => {
		const a = originOf('smb://a.test/1');
		const b = originOf('wtel:2');

		expect(a).toBeNull();
		expect(b).toBeNull();
		// the guard rejects a null allowed-origin before it ever compares
		expect(a === b && a !== null).toBe(false);
	});
});
