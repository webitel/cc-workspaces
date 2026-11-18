import { describe, expect, it } from 'vitest';

import { isWebUrl } from '../url_utils';

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
