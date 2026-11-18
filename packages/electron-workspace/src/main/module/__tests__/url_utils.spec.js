import { describe, expect, it } from 'vitest';

import { isExternalUrl } from '../url_utils';

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
