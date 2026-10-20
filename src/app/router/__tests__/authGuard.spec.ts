import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RouteLocationNormalized } from 'vue-router';

import { createAuthGuard } from '../authGuard';

const route = (query: RouteLocationNormalized['query'] = {}) =>
	({
		path: '/',
		query,
	}) as RouteLocationNormalized;

describe('authGuard', () => {
	const originalLocation = window.location;

	beforeEach(() => {
		Object.defineProperty(window, 'location', {
			value: {
				href: 'https://webitel.test/app/',
			},
			writable: true,
		});
	});

	afterEach(() => {
		Object.defineProperty(window, 'location', {
			value: originalLocation,
			writable: true,
		});
		localStorage.clear();
	});

	it('redirects to auth when no token is stored', () => {
		const onUnauthorized = vi.fn();
		const next = vi.fn();

		createAuthGuard({
			onUnauthorized,
		})(route(), route(), next);

		expect(onUnauthorized).toHaveBeenCalled();
		expect(next).not.toHaveBeenCalled();
		expect(window.location.href).toBe(
			`${import.meta.env.VITE_AUTH_URL}?redirectTo=${encodeURIComponent('https://webitel.test/app/')}`,
		);
	});

	it('redirects to auth and ignores a token passed in the url', () => {
		const next = vi.fn();

		createAuthGuard()(
			route({
				accessToken: 'foreign-token',
			}),
			route(),
			next,
		);

		expect(next).not.toHaveBeenCalled();
		expect(window.location.href).toContain(
			`${import.meta.env.VITE_AUTH_URL}?redirectTo=`,
		);
		expect(localStorage.getItem('access-token')).toBeNull();
	});

	it('strips a token from the url without storing it', () => {
		localStorage.setItem('access-token', 'own-token');
		const next = vi.fn();

		createAuthGuard()(
			route({
				accessToken: 'foreign-token',
				tab: 'list',
			}),
			route(),
			next,
		);

		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				query: {
					tab: 'list',
				},
			}),
		);
		expect(localStorage.getItem('access-token')).toBe('own-token');
	});

	it('lets navigation through when a token is stored', () => {
		localStorage.setItem('access-token', 'own-token');
		const next = vi.fn();

		createAuthGuard()(route(), route(), next);

		expect(next).toHaveBeenCalledWith();
	});
});
