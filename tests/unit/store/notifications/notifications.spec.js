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
  broadcastChannel: new BroadcastChannel('channel'),
  unreadCount: 0,
  currentlyPlaying: false,
  isConversation: false,
};

const chat = { id: '1' };

describe('notifications store: actions', () => {
  const context = {
    state,
    dispatch: jest.fn(),
    commit: jest.fn(),
    getters: {
      IS_MAIN_TAB: () => true,
      SOUND_IS_ALLOWED: () => true,
    },
    rootGetters: {
      'workspace/TASK_ON_WORKSPACE': { channelId: 'id' },
    },
  };

  beforeEach(() => {
    context.dispatch.mockClear();
    context.commit.mockClear();
  });

  it('INIT_NOTIFICATIONS action commits SET_WINDOW_ID mutation', () => {
    notificationsModule.actions.INIT_NOTIFICATIONS(context);
    expect(context.commit.mock.calls[0][0]).toContain('SET_WINDOW_ID');
  });

  it('INIT_NOTIFICATIONS action commits SET_BROADCAST_CHANNEL mutation', () => {
    notificationsModule.actions.INIT_NOTIFICATIONS(context);
    expect(context.commit.mock.calls[1][0]).toContain('SET_BROADCAST_CHANNEL');
  });

  it('INIT_NOTIFICATIONS action commits SUBSCRIBE_TAB_CLOSING action', () => {
    notificationsModule.actions.INIT_NOTIFICATIONS(context);
    expect(context.dispatch).toHaveBeenCalledWith('SUBSCRIBE_TAB_CLOSING');
  });

  it('SUBSCRIBE_TAB_CLOSING action closes broadcastChannel', () => {
    notificationsModule.actions.SUBSCRIBE_TAB_CLOSING(context);
    expect(context.state.broadcastChannel.closed).toBe(true);
  });

  it('NOTIFY action dispatches PLAY_NOTIFICATION action', () => {
    notificationsModule.actions.NOTIFY(context, { action: ChatActions.Message, chat });
    expect(context.dispatch.mock.calls[0][0]).toContain('PLAY_NOTIFICATION');
  });

  it('NOTIFY action dispatches SHOW_NOTIFICATION action if chat is not open as TASK_ON_WORKSPACE', () => {
    notificationsModule.actions.NOTIFY(context, { action: ChatActions.Message, chat });
    expect(context.dispatch.mock.calls[1][0]).toContain('SHOW_NOTIFICATION');
  });

  it('NOTIFY action dispatches SHOW_NOTIFICATION action if chat is not open as TASK_ON_WORKSPACE', () => {
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

  it('PLAY_SOUND action commits PLAY_SOUND mutation with sound', () => {
    const sound = new Audio(audio);
    notificationsModule.actions.PLAY_SOUND(context, sound);
    expect(context.commit).toHaveBeenCalledWith('PLAY_SOUND', sound);
  });

  it('STOP_PLAYING action commits STOP_PLAYING mutation', () => {
    const sound = new Audio(audio);
    notificationsModule.actions.STOP_PLAYING(context, sound);
    expect(context.commit).toHaveBeenCalledWith('STOP_PLAYING');
  });

  it('STOP_PLAYING action removes localStorage isPlaying', () => {
    const sound = new Audio(audio);
    localStorage.setItem('isPlaying', true);
    notificationsModule.actions.STOP_PLAYING(context, sound);
    expect(localStorage.getItem('isPlaying')).toBeFalsy();
  });

  it('START_CONVERSATION action sets localStorage isConversation', () => {
    notificationsModule.actions.START_CONVERSATION(context);
    expect(localStorage.getItem('isConversation')).toBeTruthy();
  });

  it('START_CONVERSATION action commits START_CONVERSATION mutation', () => {
    notificationsModule.actions.START_CONVERSATION(context);
    expect(context.commit).toHaveBeenCalledWith('START_CONVERSATION');
  });

  it('END_CONVERSATION action removes localStorage isConversation', () => {
    localStorage.setItem('isConversation', true);
    notificationsModule.actions.END_CONVERSATION(context);
    expect(localStorage.getItem('isConversation')).toBeFalsy();
  });

  it('END_CONVERSATION action commits END_CONVERSATION mutation', () => {
    notificationsModule.actions.END_CONVERSATION(context);
    expect(context.commit).toHaveBeenCalledWith('END_CONVERSATION');
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

  it('PLAY_SOUND mutation sets currentlyPlaying to state', () => {
    const isPlaying = true;
    notificationsModule.mutations.PLAY_SOUND(state, isPlaying);
    expect(state.currentlyPlaying).toBe(true);
  });

  it('STOP_PLAYING mutation sets currentlyPlaying to false in state', () => {
    notificationsModule.mutations.STOP_PLAYING(state);
    expect(state.currentlyPlaying).toBe(false);
  });

  it('SET_UNREAD_COUNT mutation sets unreadCount to state', () => {
    const unreadCount = 15;
    notificationsModule.mutations.SET_UNREAD_COUNT(state, unreadCount);
    expect(state.unreadCount).toEqual(unreadCount);
  });

  it('START_CONVERSATION mutation sets isCoversation to true', () => {
    notificationsModule.mutations.START_CONVERSATION(state);
    expect(state.isConversation).toBe(true);
  });

  it('END_CONVERSATION mutation sets isConversation to false', () => {
    notificationsModule.mutations.END_CONVERSATION(state);
    expect(state.isConversation).toBe(false);
  });
});
