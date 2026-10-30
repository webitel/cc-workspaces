import { eventBus } from '@webitel/ui-sdk/scripts';

import {
	NEW_VERSION_NOTIFICATION_TIMEOUT_SEC,
	SW_UPDATE_INTERVAL_MS,
	useAutoUpdate,
} from '../useAutoUpdate';

vi.mock('vue-i18n', () => ({
	useI18n: () => ({
		t: (key: string) => key,
	}),
}));

// [Claude] minimal fake of the browser service worker API
let registration: {
	update: ReturnType<typeof vi.fn>;
};
let swContainer: EventTarget;

const setupServiceWorker = ({ controller = {} } = {}) => {
	registration = {
		update: vi.fn(() => Promise.resolve()),
	};
	swContainer = Object.assign(new EventTarget(), {
		controller,
		ready: Promise.resolve(registration),
	});
	Object.defineProperty(navigator, 'serviceWorker', {
		value: swContainer,
		configurable: true,
	});
};

// [Claude] new SW took control of the tab
const activateNewWorker = () => {
	swContainer.dispatchEvent(new Event('controllerchange'));
};

const showTab = () => {
	document.dispatchEvent(new Event('visibilitychange'));
};

const runAutoUpdate = async () => {
	useAutoUpdate();
	await Promise.resolve();
};

describe('useAutoUpdate', () => {
	const emit = vi.spyOn(eventBus, '$emit');
	// [Claude] composable never removes its document listeners, so drop them between tests
	const addListener = vi.spyOn(document, 'addEventListener');

	beforeEach(() => {
		setupServiceWorker();
		emit.mockClear();
	});

	afterEach(() => {
		addListener.mock.calls.forEach(([type, listener]) => {
			document.removeEventListener(type, listener);
		});
		addListener.mockClear();
		vi.useRealTimers();
	});

	it('notifies the agent when a new version took control of the tab', async () => {
		await runAutoUpdate();
		activateNewWorker();

		expect(emit).toHaveBeenCalledWith('notification', {
			type: 'info',
			text: 'notification.newVersion',
			timeout: NEW_VERSION_NOTIFICATION_TIMEOUT_SEC,
		});
	});

	it('first install is not a new version', async () => {
		setupServiceWorker({
			controller: null,
		});
		await runAutoUpdate();
		activateNewWorker();

		expect(emit).not.toHaveBeenCalled();
	});

	it('checks for a new version periodically and when the tab becomes visible', async () => {
		vi.useFakeTimers();
		await runAutoUpdate();

		vi.advanceTimersByTime(SW_UPDATE_INTERVAL_MS);
		expect(registration.update).toHaveBeenCalledTimes(1);

		showTab();
		expect(registration.update).toHaveBeenCalledTimes(2);
	});

	it('reminds about the new version when the tab becomes visible again', async () => {
		vi.useFakeTimers();
		await runAutoUpdate();
		activateNewWorker();
		emit.mockClear();

		// [Claude] previous toast is still shown - no second one
		showTab();
		expect(emit).not.toHaveBeenCalled();

		vi.advanceTimersByTime(NEW_VERSION_NOTIFICATION_TIMEOUT_SEC * 1000);
		showTab();

		expect(emit).toHaveBeenCalledTimes(1);
		expect(registration.update).not.toHaveBeenCalled();
	});
});
