import { ChatActions } from 'webitel-sdk';
import audio from '../../../../public/media/new-message.wav';
import notificationsModule from '../../../../src/store/modules/notifications/notifications';

global.BroadcastChannel = class BroadcastChannel {
  constructor(name) {
    this.name = name;
    this.closed = false;
  }

  addEventListener(event, cb) {
    this.event = event;
  }

  postMessage(message) {
    this.message = message;
  }

  close() {
    this.closed = true;
  }
};

const state = {
  windowId: null,
  broadcastChannel: new BroadcastChannel('appNotifications'),
  unreadCount: 0,
  currentlyPlaying: false,
  isCall: false,
};

const chat = { id: '1' };

describe('notifications store: actions', () => {
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

  it('INIT_NOTIFICATIONS action dispatches SETUP_WINDOW_ID action', () => {
    notificationsModule.actions.INIT_NOTIFICATIONS(context);
    expect(context.dispatch.mock.calls[0][0]).toContain('SETUP_WINDOW_ID');
  });

  it('INIT_NOTIFICATIONS action commits SET_BROADCAST_CHANNEL mutation', () => {
    notificationsModule.actions.INIT_NOTIFICATIONS(context);
    expect(context.commit.mock.calls[0][0]).toContain('SET_BROADCAST_CHANNEL');
  });

  it('INIT_NOTIFICATIONS action commits SETUP_WINDOW_ID action', () => {
    notificationsModule.actions.INIT_NOTIFICATIONS(context);
    expect(context.dispatch).toHaveBeenCalledWith('SETUP_WINDOW_ID');
  });

  it('NOTIFY action dispatches PLAY_NOTIFICATION action', () => {
    notificationsModule.actions.NOTIFY(context, { action: ChatActions.Message, chat });
    expect(context.dispatch.mock.calls[0][0]).toContain('PLAY_NOTIFICATION');
  });

  it('NOTIFY action dispatches SHOW_NOTIFICATION action if chat is not open as TASK_ON_WORKSPACE', () => {
    notificationsModule.actions.NOTIFY(context, { action: ChatActions.Message, chat });
    expect(context.dispatch.mock.calls[1][0]).toContain('SHOW_NOTIFICATION');
  });

  it('NOTIFY action does not dispatch SHOW_NOTIFICATION action if chat is open as TASK_ON_WORKSPACE', () => {
    context.rootGetters['workspace/TASK_ON_WORKSPACE'].channelId = '1';
    notificationsModule.actions.NOTIFY(context, { action: ChatActions.Message, chat });
    expect(context.dispatch.mock.calls[0][0]).not.toContain('SHOW_NOTIFICATION');
  });

  it('SHOW_NOTIFICATION action dispatches INCREMENT_UNREAD_COUNT', () => {
    notificationsModule.actions.SHOW_NOTIFICATION(context, ChatActions.Message);
    expect(context.dispatch).toHaveBeenCalledWith('INCREMENT_UNREAD_COUNT');
  });

  it('INCREMENT_UNREAD_COUNT action dispatches SET_UNREAD_COUNT and increases unreadCount', () => {
    notificationsModule.actions.INCREMENT_UNREAD_COUNT(context);
    expect(context.dispatch).toHaveBeenCalledWith('SET_UNREAD_COUNT', context.state.unreadCount + 1);
  });

  it('SET_UNREAD_COUNT dispatches SET_TAB_TITLE action', () => {
    const unreadCount = 5;
    notificationsModule.actions.SET_UNREAD_COUNT(context, unreadCount);
    expect(context.dispatch).toHaveBeenCalledWith('SET_TAB_TITLE');
  });

  it('SET_UNREAD_COUNT action commits SET_UNREAD_COUNT mutation with count', () => {
    const unreadCount = 5;
    notificationsModule.actions.SET_UNREAD_COUNT(context, unreadCount);
    expect(context.commit).toHaveBeenCalledWith('SET_UNREAD_COUNT', unreadCount);
  });

  it('RESET_UNREAD_COUNT action dispatches SET_UNREAD_COUNT action with unread count equal to 0', () => {
    notificationsModule.actions.RESET_UNREAD_COUNT(context);
    expect(context.dispatch).toHaveBeenCalledWith('SET_UNREAD_COUNT', 0);
  });

  it('PLAY_NOTIFICATION action dispatches PLAY_SOUND action with sound audio', () => {
    const sound = new Audio(audio);
    notificationsModule.actions.PLAY_NOTIFICATION(context, sound);
    expect(context.dispatch).toHaveBeenCalledWith('PLAY_SOUND', sound);
  });

  it('RING_CALL action dispatches PLAY_SOUND action with sound audio', () => {
    const sound = new Audio(audio);
    sound.loop = true;
    notificationsModule.actions.RING_CALL(context);
    expect(context.dispatch).toHaveBeenCalledWith('PLAY_SOUND', sound);
  });

  it('PLAY_SOUND action sets localStorage isPlaying to true', () => {
    const sound = new Audio(audio);
    notificationsModule.actions.PLAY_SOUND(context, sound);
    expect(localStorage.getItem('isPlaying')).toBeTruthy();
  });

  it('PLAY_SOUND action commits SET_CURRENTLY_PLAIYNG mutation with sound', () => {
    const sound = new Audio(audio);
    notificationsModule.actions.PLAY_SOUND(context, sound);
    expect(context.commit).toHaveBeenCalledWith('SET_CURRENTLY_PLAYING', sound);
  });

  it('STOP_PLAYING action commits RESET_CURRENTLY_PLAYING mutation', () => {
    const sound = new Audio(audio);
    notificationsModule.actions.STOP_PLAYING(context, sound);
    expect(context.commit).toHaveBeenCalledWith('RESET_CURRENTLY_PLAYING');
  });

  it('STOP_PLAYING action removes localStorage isPlaying', () => {
    const sound = new Audio(audio);
    localStorage.setItem('isPlaying', true);
    notificationsModule.actions.STOP_PLAYING(context, sound);
    expect(localStorage.getItem('isPlaying')).toBeFalsy();
  });

  it('HANDLE_START_CALL action sets localStorage isCall', () => {
    notificationsModule.actions.HANDLE_START_CALL(context);
    expect(localStorage.getItem('isCall')).toBeTruthy();
  });

  it('HANDLE_START_CALL action commits HANDLE_START_CALL mutation', () => {
    notificationsModule.actions.HANDLE_START_CALL(context);
    expect(context.commit).toHaveBeenCalledWith('HANDLE_START_CALL');
  });

  it('HANDLE_END_CALL action removes localStorage isCall', () => {
    localStorage.setItem('isCall', true);
    notificationsModule.actions.HANDLE_END_CALL(context);
    expect(localStorage.getItem('isCall')).toBeFalsy();
  });

  it('HANDLE_END_CALL action commits HANDLE_END_CALL mutation', () => {
    notificationsModule.actions.HANDLE_END_CALL(context);
    expect(context.commit).toHaveBeenCalledWith('HANDLE_END_CALL');
  });
});

describe('notifications store: mutations', () => {
  it('SET_WINDOW_ID sets window id to state', () => {
    const windowId = 'windowId';
    notificationsModule.mutations.SET_WINDOW_ID(state, windowId);
    expect(state.windowId).toBe(windowId);
  });

  it('SET_BROADCAST_CHANNEL sets broadcastChannel to state', () => {
    const state = { broadcastChannel: null };
    const channel = new BroadcastChannel('test channel');
    notificationsModule.mutations.SET_BROADCAST_CHANNEL(state, channel);
    expect(state.broadcastChannel).toEqual(channel);
  });

  it('SET_CURRENTLY_PLAIYNG mutation sets currentlyPlaying to state', () => {
    const isPlaying = true;
    notificationsModule.mutations.SET_CURRENTLY_PLAYING(state, isPlaying);
    expect(state.currentlyPlaying).toBe(true);
  });

  it('RESET_CURRENTLY_PLAYING mutation sets currentlyPlaying to false in state', () => {
    notificationsModule.mutations.RESET_CURRENTLY_PLAYING(state);
    expect(state.currentlyPlaying).toBe(false);
  });

  it('SET_UNREAD_COUNT mutation sets unreadCount to state', () => {
    const unreadCount = 15;
    notificationsModule.mutations.SET_UNREAD_COUNT(state, unreadCount);
    expect(state.unreadCount).toEqual(unreadCount);
  });

  it('HANDLE_START_CALL mutation sets isCoversation to true', () => {
    notificationsModule.mutations.HANDLE_START_CALL(state);
    expect(state.isCall).toBe(true);
  });

  it('HANDLE_END_CALL mutation sets isCall to false', () => {
    notificationsModule.mutations.HANDLE_END_CALL(state);
    expect(state.isCall).toBe(false);
  });
});
