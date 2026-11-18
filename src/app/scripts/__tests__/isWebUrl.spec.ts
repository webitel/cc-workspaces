import { describe, expect, it } from 'vitest';

import { isWebUrl } from '../isWebUrl';

describe('isWebUrl', () => {
	it.each([
		'https://example.test/page',
		'http://example.test/page',
	])('allows %s', (url) => {
		expect(isWebUrl(url)).toBe(true);
	});

	it.each([
		'smb://attacker.test/share',
		// a scheme-relative URL has no scheme of its own to check
		'//example.test/page',
		null,
	])('refuses %s', (url) => {
		expect(isWebUrl(url)).toBe(false);
	});
});
