import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { setTokenFromUrl } from '../setTokenFromUrl';

describe('setTokenFromUrl', () => {
	beforeEach(() => {
		window.history.replaceState(null, '', '/?accessToken=url-token&tab=1');
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		window.history.replaceState(null, '', '/');
		localStorage.clear();
	});

	it('does not store a token from the url outside dev mode', () => {
		vi.stubEnv('DEV', false);

		setTokenFromUrl();

		expect(localStorage.getItem('access-token')).toBeNull();
	});

	it('does not overwrite the stored token outside dev mode', () => {
		vi.stubEnv('DEV', false);
		localStorage.setItem('access-token', 'own-token');

		setTokenFromUrl();

		expect(localStorage.getItem('access-token')).toBe('own-token');
	});

	it('stores a token from the url in dev mode', () => {
		vi.stubEnv('DEV', true);

		setTokenFromUrl();

		expect(localStorage.getItem('access-token')).toBe('url-token');
	});
});
