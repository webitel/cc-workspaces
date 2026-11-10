import { describe, expect, it } from 'vitest';

import { isWebUrl } from '../isWebUrl';

describe('isWebUrl', () => {
	it.each([
		'https://example.test/page',
		'http://example.test/page',
		'https://example.test:8443/page?q=1',
	])('allows %s', (url) => {
		expect(isWebUrl(url)).toBe(true);
	});

	it.each([
		'javascript:alert(1)',
		'vbscript:msgbox(1)',
		'data:text/html,<script>alert(1)</script>',
		'file:///etc/passwd',
		'smb://attacker.test/share',
		'ms-settings://x',
		'wtel:test;x=1',
		// a scheme-relative URL has no scheme of its own to check
		'//example.test/page',
		'/relative/path',
		'',
	])('refuses %s', (url) => {
		expect(isWebUrl(url)).toBe(false);
	});

	it.each([
		undefined,
		null,
	])('refuses the empty value %s', (url) => {
		expect(isWebUrl(url)).toBe(false);
	});
});
