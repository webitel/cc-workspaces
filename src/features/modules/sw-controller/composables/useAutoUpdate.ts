import { eventBus } from '@webitel/ui-sdk/scripts';
import { useI18n } from 'vue-i18n';

// [Claude] browser checks sw.js only on navigation, the workspace tab stays open all day
export const SW_UPDATE_INTERVAL_MS = 60 * 60 * 1000;
export const NEW_VERSION_NOTIFICATION_TIMEOUT_SEC = 30;

/**
 * [Claude] after a release the new service worker takes over on its own (skipWaiting in sw.js),
 * so a plain F5 is enough to get the new version, no hard reload.
 * Here we only check for a new release while the tab stays open and tell the agent to reload.
 * No auto reload: after it the agent has to confirm the welcome popup to get calls/chats again.
 */
export const useAutoUpdate = () => {
	const sw = navigator.serviceWorker;
	if (!sw) return;

	const { t } = useI18n();

	let isNewVersionActive = false;
	let lastNotifiedAt = 0;

	const notifyNewVersion = () => {
		// [Claude] don't stack toasts on fast tab switching, previous one is still shown
		if (
			Date.now() - lastNotifiedAt <
			NEW_VERSION_NOTIFICATION_TIMEOUT_SEC * 1000
		) {
			return;
		}
		lastNotifiedAt = Date.now();
		eventBus.$emit('notification', {
			type: 'info',
			text: t('notification.newVersion'),
			timeout: NEW_VERSION_NOTIFICATION_TIMEOUT_SEC,
		});
	};

	// [Claude] first install also fires controllerchange (clients.claim), that is not a new release
	let hasController = !!sw.controller;
	sw.addEventListener('controllerchange', () => {
		if (hasController) {
			isNewVersionActive = true;
			notifyNewVersion();
		}
		hasController = true;
	});

	sw.ready.then((registration) => {
		const checkForUpdate = () => {
			// [Claude] failed check (e.g. offline) is not an error, next one will retry
			registration.update().catch(() => {});
		};

		setInterval(checkForUpdate, SW_UPDATE_INTERVAL_MS);
		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState !== 'visible') return;
			// [Claude] remind again, the toast may have been missed while the tab was hidden
			if (isNewVersionActive) notifyNewVersion();
			else checkForUpdate();
		});
	});
};
