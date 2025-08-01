import '../../../../../../tests/unit/mocks/broadcastChannelMock';

import { ChatActions } from 'webitel-sdk';

import callNotificationsModule from '../../call/store/call';
import chatNotificationsModule from '../../chat/store/chat';

const state = {
  thisTabId: null,
  broadcastChannel: new BroadcastChannel('WtAppNotifications'),
  unreadCount: 0,
  currentlyPlaying: false,
  wtIsPlaying: false,
};

const chat = { id: '1', messages: [{ member: { name: 'name' } }] };

describe('features/notifications store: actions', () => {
  const context = {
    dispatch: vi.fn(),
    commit: vi.fn(),
    getters: {
      IS_MAIN_TAB: () => true,
      IS_SOUND_ALLOWED: () => true,
    },
    rootGetters: {
      'workspace/TASK_ON_WORKSPACE': { channelId: 'id' },
      'features/notifications/GET_NOTIFICATION_SETTING': () => {
        return true;
      },
      'features/notifications/SET_CURRENTLY_PLAYING': () => {},
    },
  };

  beforeEach(() => {
    context.state = { ...state };
    context.dispatch.mockClear();
    context.commit.mockClear();
  });

  it('HANDLE_CHAT_EVENT action dispatches _PLAY_NOTIFICATION_SOUND action', () => {
    chatNotificationsModule.actions.HANDLE_CHAT_EVENT(context, {
      action: ChatActions.Message,
      chat,
    });
    expect(context.dispatch.mock.calls[0][0]).toContain('PLAY_SOUND');
  });

  it('HANDLE_CHAT_EVENT action dispatches SEND_NOTIFICATION action if chat is not open as TASK_ON_WORKSPACE', () => {
    chatNotificationsModule.actions.HANDLE_CHAT_EVENT(context, {
      action: ChatActions.Message,
      chat,
    });
    expect(context.dispatch.mock.calls[1][0]).toContain('SEND_NOTIFICATION');
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
