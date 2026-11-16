import { describe, expect, it } from 'vitest';

import { isWebUrl, originOf } from '../url_utils';

describe('isWebUrl', () => {
	it.each([
		'https://example.test/workspace',
		'http://example.test/workspace',
	])('allows %s', (url) => {
		expect(isWebUrl(url)).toBe(true);
	});

	it.each([
		'smb://attacker.test/share',
		'//example.test/workspace',
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
		'not a url',
	])('returns null for %s', (url) => {
		expect(originOf(url)).toBeNull();
	});
});
