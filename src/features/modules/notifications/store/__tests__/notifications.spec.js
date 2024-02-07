import { CallActions, ChatActions } from 'webitel-sdk';
import notificationsModule from '../notifications';
import '../../../../../../tests/unit/mocks/broadcastChannelMock';

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
    },
  };

  beforeEach(() => {
    context.state = { ...state };
    context.dispatch.mockClear();
    context.commit.mockClear();
  });

  it('HANDLE_CHAT_EVENT action dispatches _PLAY_NOTIFICATION_SOUND action', () => {
    notificationsModule.actions.HANDLE_CHAT_EVENT(context, { action: ChatActions.Message, chat });
    expect(context.dispatch.mock.calls[0][0]).toContain('PLAY_SOUND');
  });

  it('HANDLE_CHAT_EVENT action dispatches SEND_NOTIFICATION action if chat is not open as TASK_ON_WORKSPACE', () => {
    notificationsModule.actions.HANDLE_CHAT_EVENT(context, { action: ChatActions.Message, chat });
    expect(context.dispatch.mock.calls[1][0]).toContain('SEND_NOTIFICATION');
  });

  it('HANDLE_CHAT_EVENT action does not dispatch SEND_NOTIFICATION action if chat is open as TASK_ON_WORKSPACE', () => {
    context.rootGetters['workspace/TASK_ON_WORKSPACE'].channelId = '1';
    notificationsModule.actions.HANDLE_CHAT_EVENT(context, { action: ChatActions.Message, chat });
    expect(context.dispatch.mock.calls[0][0]).not.toContain('SEND_NOTIFICATION');
  });

  it('HANDLE_ANY_CALL_RINGING action dispatches PLAY_SOUND action with sound audio', () => {
    notificationsModule.actions.HANDLE_ANY_CALL_RINGING(context);
    expect(context.dispatch).toHaveBeenCalledWith('PLAY_SOUND', { action: CallActions.Ringing });
  });

  it('HANDLE_CALL_START action sets localStorage wtIsPlaying', async () => {
    await notificationsModule.actions.HANDLE_CALL_START(context);
    expect(localStorage.getItem('wtIsPlaying')).toBeTruthy();
  });

  it('HANDLE_CALL_START action commits SET_CURRENTLY_PLAYING mutation', async () => {
    await notificationsModule.actions.HANDLE_CALL_START(context);
    expect(context.commit).toHaveBeenCalledWith('SET_CURRENTLY_PLAYING', true);
  });

  it('HANDLE_CALL_END action removes localStorage wtIsPlaying', async () => {
    localStorage.setItem('wtIsPlaying', true);
    await notificationsModule.actions.HANDLE_CALL_END(context);
    expect(localStorage.getItem('wtIsPlaying')).toBeFalsy();
  });

  it('HANDLE_CALL_END action commits SET_CURRENTLY_PLAYING mutation', async () => {
    await notificationsModule.actions.HANDLE_CALL_END(context);
    expect(context.commit).toHaveBeenCalledWith('SET_CURRENTLY_PLAYING', null);
  });
});
