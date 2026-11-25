// https://vite-pwa-org.netlify.app/guide/inject-manifest.html
import { clientsClaim } from 'workbox-core';
import {
	cleanupOutdatedCaches,
	matchPrecache,
	precacheAndRoute,
} from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';

self.__WB_DISABLE_DEV_LOGS = true;

self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();

/**
 * [Claude] page navigations (index.html) go to the network, not to the precache.
 * index.html points to the hashed chunks of one build. Served from the precache it keeps
 * the open workspace on the old build until this sw.js itself updates, and sw.js can be
 * served stale for hours (Cloudflare caches it at the edge with max-age=14400).
 * Precached index.html is only an offline fallback.
 * Must be registered before precacheAndRoute: the first matching route wins.
 */
const fetchFreshPage = async ({ request }) => {
	try {
		// [Claude] 'no-cache' revalidates with the server, so the browser HTTP cache can't return an old index.html either
		return await fetch(
			new Request(request, {
				cache: 'no-cache',
			}),
		);
	} catch {
		return (await matchPrecache('index.html')) || Response.error();
	}
};
registerRoute(new NavigationRoute(fetchFreshPage));

// https://webitel.atlassian.net/browse/WTEL-5434
precacheAndRoute(self.__WB_MANIFEST);

// https://webitel.atlassian.net/browse/WTEL-4240
const showNotification = ({ title, body, actions }) =>
	self.registration.showNotification(title, {
		body,
		actions,
		icon: '/workspace/pwa-192x192.png',
	});

self.addEventListener('message', async (event) => {
	const { type, payload } = event.data;
	switch (type) {
		case 'notification':
			await showNotification(payload);
			break;
		default:
			console.info('Unknown message type', type);
	}
});

self.addEventListener('notificationclick', async (event) => {
	const clients = await self.clients.matchAll();
	clients.forEach((client) => {
		client.postMessage({
			type: 'notificationclick',
			action: event.action,
		});
	});
	event.notification.close();
});
