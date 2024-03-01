// https://vite-pwa-org.netlify.app/guide/inject-manifest.html
import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

const showNotification = ({
                            title,
                            body,
                            actions,
                          }) => self.registration.showNotification(title, {
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
