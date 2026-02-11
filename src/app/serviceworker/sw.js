// https://vite-pwa-org.netlify.app/guide/inject-manifest.html
import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

self.__WB_DISABLE_DEV_LOGS = true;

self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();

// https://webitel.atlassian.net/browse/WTEL-5434
precacheAndRoute(self.__WB_MANIFEST);

// https://webitel.atlassian.net/browse/WTEL-4240
const showNotification = ({ title, body, actions }) =>
	self.registration.showNotification(title, {
		body,
		actions,
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
