import { afterEach, describe, expect, it } from 'vitest';
import {
	ENABLED_STORAGE_KEY,
	ENABLED_TTL_MS,
	resolveEnabled,
	stripUrlFlag,
} from '../config';

const NOW = 1_800_000_000_000;

function openWith(search: string) {
	window.history.replaceState(null, '', `/workspace/${search}`);
}

describe('resolveEnabled', () => {
	afterEach(() => {
		localStorage.clear();
		openWith('');
	});

	it('is off by default', () => {
		expect(resolveEnabled(NOW)).toBe(false);
	});

	it('turns on from ?debug=1 and stays on after the param is gone, until the TTL', () => {
		openWith('?debug=1');
		expect(resolveEnabled(NOW)).toBe(true);

		openWith('');
		expect(resolveEnabled(NOW + ENABLED_TTL_MS - 1)).toBe(true);
		expect(resolveEnabled(NOW + ENABLED_TTL_MS)).toBe(false);
		expect(localStorage.getItem(ENABLED_STORAGE_KEY)).toBeNull();
	});

	it('turns off from ?debug=0', () => {
		openWith('?debug=1');
		resolveEnabled(NOW);
		openWith('?debug=0');
		expect(resolveEnabled(NOW)).toBe(false);
	});

	it('ignores the pre-TTL "1" value', () => {
		localStorage.setItem(ENABLED_STORAGE_KEY, '1');
		expect(resolveEnabled(NOW)).toBe(false);
	});
});

describe('stripUrlFlag', () => {
	afterEach(() => {
		openWith('');
	});

	it('removes debug from the query and the hash query, keeps the rest', () => {
		window.history.replaceState(
			null,
			'',
			'/workspace/?debug=1&lang=uk#/queue?debug=1&tab=2',
		);
		stripUrlFlag();
		expect(
			window.location.pathname + window.location.search + window.location.hash,
		).toBe('/workspace/?lang=uk#/queue?tab=2');
	});

	it('leaves a URL without the flag alone', () => {
		openWith('?x=1');
		stripUrlFlag();
		expect(window.location.search).toBe('?x=1');
	});
});
