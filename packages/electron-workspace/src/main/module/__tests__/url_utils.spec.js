import { describe, expect, it } from 'vitest';

import { isExternalUrl, originOf } from '../url_utils';

describe('isExternalUrl', () => {
	it.each([
		'https://example.test/workspace',
		'http://example.test/workspace',
		'mailto:agent@example.test',
		'tel:+380441234567',
	])('allows %s', (url) => {
		expect(isExternalUrl(url)).toBe(true);
	});

	it.each([
		'smb://attacker.test/share',
		'//example.test/workspace',
	])('refuses %s', (url) => {
		expect(isExternalUrl(url)).toBe(false);
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
