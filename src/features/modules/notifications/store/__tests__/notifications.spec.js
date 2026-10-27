import '../../../../../../tests/unit/mocks/broadcastChannelMock';

import { EngineSystemSettingName } from '@webitel/api-services/gen/models';
import { ChatActions } from 'webitel-sdk';

import callNotificationsModule from '../../call/store/call.js';
import chatNotificationsModule from '../../chat/store/chat.js';
import notificationsModule from '../notifications';

const state = {
	thisTabId: null,
	broadcastChannel: new BroadcastChannel('WtAppNotifications'),
	unreadCount: 0,
	currentlyPlaying: false,
	wtIsPlaying: false,
};

const chat = {
	id: '1',
	messages: [
		{
			member: {
				name: 'name',
			},
		},
	],
};

describe('features/notifications store: actions', () => {
	const context = {
		dispatch: vi.fn(),
		commit: vi.fn(),
		getters: {
			IS_MAIN_TAB: () => true,
			IS_SOUND_ALLOWED: () => true,
		},
		rootGetters: {
			'workspace/TASK_ON_WORKSPACE': {
				channelId: 'id',
			},
			'features/notifications/GET_NOTIFICATION_SETTING': () => {
				return true;
			},
			'features/notifications/SET_CURRENTLY_PLAYING': () => {},
		},
	};

	beforeEach(() => {
		context.state = {
			...state,
		};
		context.dispatch.mockClear();
		context.commit.mockClear();
	});

	it('HANDLE_CHAT_EVENT action dispatches _PLAY_NOTIFICATION_SOUND action', () => {
		chatNotificationsModule.actions.HANDLE_CHAT_EVENT(context, {
			action: ChatActions.Message,
			chat,
		});
		expect(context.dispatch.mock.calls[0][0]).toContain('STOP_SOUND');
		expect(context.dispatch.mock.calls[1][0]).toContain('PLAY_SOUND');
	});

	it('HANDLE_CHAT_EVENT action dispatches SEND_NOTIFICATION action if chat is not open as TASK_ON_WORKSPACE', () => {
		chatNotificationsModule.actions.HANDLE_CHAT_EVENT(context, {
			action: ChatActions.Message,
			chat,
		});
		expect(
			context.dispatch.mock.calls.some(([type]) =>
				type.includes('SEND_NOTIFICATION'),
			),
		).toBe(true);
	});

	it('HANDLE_CHAT_EVENT action does not dispatch SEND_NOTIFICATION action if chat is open as TASK_ON_WORKSPACE', () => {
		context.rootGetters['workspace/TASK_ON_WORKSPACE'].channelId = '1';
		chatNotificationsModule.actions.HANDLE_CHAT_EVENT(context, {
			action: ChatActions.Message,
			chat,
		});
		expect(context.dispatch.mock.calls[0][0]).not.toContain(
			'SEND_NOTIFICATION',
		);
	});

	it('HANDLE_CALL_START action sets localStorage wtIsPlaying', async () => {
		await callNotificationsModule.actions.HANDLE_CALL_START(context);
		expect(localStorage.getItem('wtIsPlaying')).toBeTruthy();
	});

	it('HANDLE_CALL_START action commits SET_CURRENTLY_PLAYING mutation', async () => {
		await callNotificationsModule.actions.HANDLE_CALL_START(context);
		expect(context.commit).toHaveBeenCalledWith(
			'features/notifications/SET_CURRENTLY_PLAYING',
			true,
			{
				root: true,
			},
		);
	});
});

describe('features/notifications store: HANDLE_SYSTEM_SETTING_CHANGE', () => {
	const context = {
		dispatch: vi.fn(),
	};

	beforeEach(() => {
		vi.useFakeTimers();
		context.dispatch.mockClear();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('reloads notification settings once for a burst of notification setting changes', () => {
		notificationsModule.actions.HANDLE_SYSTEM_SETTING_CHANGE(context, {
			name: EngineSystemSettingName.CallEndSoundNotification,
			value: false,
		});
		notificationsModule.actions.HANDLE_SYSTEM_SETTING_CHANGE(context, {
			name: EngineSystemSettingName.PushNotificationTimeout,
		});
		vi.runAllTimers();

		expect(context.dispatch).toHaveBeenCalledTimes(1);
		expect(context.dispatch).toHaveBeenCalledWith('LOAD_NOTIFICATION_SETTINGS');
	});

	it('ignores settings that are not notification ones', () => {
		notificationsModule.actions.HANDLE_SYSTEM_SETTING_CHANGE(context, {
			name: EngineSystemSettingName.ShowFullContact,
			value: true,
		});
		vi.runAllTimers();

		expect(context.dispatch).not.toHaveBeenCalled();
	});
});

describe('features/notifications store: RELEASE_SOUND_LOCK', () => {
	const context = {
		commit: vi.fn(),
		state: {},
	};

	beforeEach(() => {
		context.commit.mockClear();
	});

	it('resets the call-in-progress lock', () => {
		context.state.currentlyPlaying = true;
		notificationsModule.actions.RELEASE_SOUND_LOCK(context);
		expect(context.commit).toHaveBeenCalledWith('SET_CURRENTLY_PLAYING', null);
	});

	// [Claude] https://webitel.atlassian.net/browse/WTEL-10753
	it('keeps a playing sound, so it can still be stopped', () => {
		context.state.currentlyPlaying = new Audio();
		notificationsModule.actions.RELEASE_SOUND_LOCK(context);
		expect(context.commit).not.toHaveBeenCalled();
	});
});
