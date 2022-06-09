import { ChatActions } from 'webitel-sdk';
import audio from '../../../../../../public/media/new-message.wav';
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
    dispatch: jest.fn(),
    commit: jest.fn(),
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

  it('INITIALIZE action dispatches _SETUP_THIS_TAB_ID action', () => {
    notificationsModule.actions.INITIALIZE(context);
    expect(context.dispatch.mock.calls[0][0]).toContain('_SETUP_THIS_TAB_ID');
  });

  it('INITIALIZE action dispatches _SETUP_UNREAD_COUND_BROADCAST_LISTENING action', () => {
    notificationsModule.actions.INITIALIZE(context);
    expect(context.dispatch.mock.calls[1][0]).toContain('_SETUP_UNREAD_COUND_BROADCAST_LISTENING');
  });

  it('INITIALIZE action commits _SETUP_THIS_TAB_ID action', () => {
    notificationsModule.actions.INITIALIZE(context);
    expect(context.dispatch).toHaveBeenCalledWith('_SETUP_THIS_TAB_ID');
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

  it('INCREMENT_UNREAD_COUNT action dispatches _SET_UNREAD_COUNT and increases unreadCount', () => {
    notificationsModule.actions.INCREMENT_UNREAD_COUNT(context);
    expect(context.dispatch).toHaveBeenCalledWith('_SET_UNREAD_COUNT', context.state.unreadCount + 1);
  });

  it('_SETUP_UNREAD_COUND_BROADCAST_LISTENING action commits SET_BROADCAST_CHANNEL mutation', () => {
    notificationsModule.actions._SETUP_UNREAD_COUND_BROADCAST_LISTENING(context);
    expect(context.commit.mock.calls[0][0]).toContain('SET_BROADCAST_CHANNEL');
  });

  it('PLAY_SOUND action commits SET_CURRENTLY_PLAIYNG mutation with sound', async () => {
    const sound = new Audio(audio);
    await notificationsModule.actions.PLAY_SOUND(context, { sound });
    expect(context.commit).toHaveBeenCalledWith('SET_CURRENTLY_PLAYING', sound);
  });

  it('_SET_UNREAD_COUNT dispatches _SET_TAB_TITLE action', () => {
    const unreadCount = 5;
    notificationsModule.actions._SET_UNREAD_COUNT(context, unreadCount);
    expect(context.dispatch).toHaveBeenCalledWith('_SET_TAB_TITLE');
  });

  it('_SET_UNREAD_COUNT action commits _SET_UNREAD_COUNT mutation with count', () => {
    const unreadCount = 5;
    notificationsModule.actions._SET_UNREAD_COUNT(context, unreadCount);
    expect(context.commit).toHaveBeenCalledWith('SET_UNREAD_COUNT', unreadCount);
  });

  it('_RESET_UNREAD_COUNT action does not dispatch if unread count is 0', () => {
    notificationsModule.actions._RESET_UNREAD_COUNT(context);
    expect(context.dispatch).not.toHaveBeenCalledWith('_SET_UNREAD_COUNT');
  });

  it('_RESET_UNREAD_COUNT action dispatches _SET_UNREAD_COUNT passing unread count equal to 0', () => {
    context.state.unreadCount = 1;
    notificationsModule.actions._RESET_UNREAD_COUNT(context);
    expect(context.dispatch).toHaveBeenCalledWith('_SET_UNREAD_COUNT', 0);
  });

  it('HANDLE_ANY_CALL_RINGING action dispatches PLAY_SOUND action with sound audio', () => {
    const sound = new Audio(audio);
    sound.loop = true;
    notificationsModule.actions.HANDLE_ANY_CALL_RINGING(context);
    expect(context.dispatch).toHaveBeenCalledWith('PLAY_SOUND', { sound });
  });

  it('PLAY_SOUND action sets localStorage wtIsPlaying to true', () => {
    const sound = new Audio(audio);
    notificationsModule.actions.PLAY_SOUND(context, { sound });
    expect(localStorage.getItem('wtIsPlaying')).toBeTruthy();
  });

  it('STOP_SOUND action commits RESET_CURRENTLY_PLAYING mutation', () => {
    notificationsModule.actions.STOP_SOUND(context);
    expect(context.commit).toHaveBeenCalledWith('RESET_CURRENTLY_PLAYING');
  });

  it('STOP_SOUND action removes localStorage wtIsPlaying', () => {
    localStorage.setItem('wtIsPlaying', 'true');
    notificationsModule.actions.STOP_SOUND(context);
    expect(localStorage.getItem('wtIsPlaying')).toBeFalsy();
  });

  it('HANDLE_CALL_START action sets localStorage wtIsPlaying', async () => {
    await notificationsModule.actions.HANDLE_CALL_START(context);
    expect(localStorage.getItem('wtIsPlaying')).toBeTruthy();
  });

  it('HANDLE_CALL_START action commits SET_CURRENTLY_PLAYING mutation', async () => {
    await notificationsModule.actions.HANDLE_CALL_START(context);
    expect(context.commit).toHaveBeenCalledWith('SET_CURRENTLY_PLAYING', true);
  });

  it('HANDLE_CALL_END action removes localStorage wtIsPlaying', () => {
    localStorage.setItem('wtIsPlaying', true);
    notificationsModule.actions.HANDLE_CALL_END(context);
    expect(localStorage.getItem('wtIsPlaying')).toBeFalsy();
  });

  it('HANDLE_CALL_END action commits SET_CURRENTLY_PLAYING mutation', () => {
    notificationsModule.actions.HANDLE_CALL_END(context);
    expect(context.commit).toHaveBeenCalledWith('SET_CURRENTLY_PLAYING', null);
  });
});

describe('features/notifications store: mutations', () => {
  it('SET_THIS_TAB_ID sets window id to state', () => {
    const thisTabId = 'thisTabId';
    notificationsModule.mutations.SET_THIS_TAB_ID(state, thisTabId);
    expect(state.thisTabId).toBe(thisTabId);
  });

  it('SET_BROADCAST_CHANNEL sets broadcastChannel to state', () => {
    const state = { broadcastChannel: null };
    const channel = new BroadcastChannel('test channel');
    notificationsModule.mutations.SET_BROADCAST_CHANNEL(state, channel);
    expect(state.broadcastChannel).toEqual(channel);
  });

  it('SET_CURRENTLY_PLAIYNG mutation sets currentlyPlaying to state', () => {
    const wtIsPlaying = true;
    notificationsModule.mutations.SET_CURRENTLY_PLAYING(state, wtIsPlaying);
    expect(state.currentlyPlaying).toBe(true);
  });

  it('RESET_CURRENTLY_PLAYING mutation sets currentlyPlaying to false in state', () => {
    notificationsModule.mutations.RESET_CURRENTLY_PLAYING(state);
    expect(state.currentlyPlaying).toBe(false);
  });

  it('_SET_UNREAD_COUNT mutation sets unreadCount to state', () => {
    const unreadCount = 15;
    notificationsModule.mutations.SET_UNREAD_COUNT(state, unreadCount);
    expect(state.unreadCount).toEqual(unreadCount);
  });
});
