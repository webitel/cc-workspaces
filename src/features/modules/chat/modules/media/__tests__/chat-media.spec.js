import chatModule from '../store/chat-media.js';

const chatOnWorkspace = {
  id: '1',
  messages: [{ text: 'Hello' }],
  join: vi.fn(),
  decline: vi.fn(),
  leave: vi.fn(),
  send: vi.fn(),
  sendText: vi.fn(),
  transferToUser: vi.fn(),
  transferToPlan: vi.fn(),
};

describe('features/chat/chatMedia store: actions', () => {
  const context = {
    state: {
      mediaView: null,
    },
    getters: {
      CHAT_ON_WORKSPACE: chatOnWorkspace,
    },
    dispatch: vi.fn(),
    commit: vi.fn(),
  };

  beforeEach(() => {
    context.getters = {
      CHAT_ON_WORKSPACE: chatOnWorkspace,
    };
    chatOnWorkspace.join.mockClear();
    chatOnWorkspace.leave.mockClear();
    chatOnWorkspace.decline.mockClear();
    chatOnWorkspace.transferToUser.mockClear();
    chatOnWorkspace.transferToPlan.mockClear();
    context.dispatch.mockClear();
    context.commit.mockClear();
  });



  it('OPEN_MEDIA commits SET_MEDIA_VIEW mutation with passed message to open', () => {
    const message = { id: '1' };
    chatModule.actions.OPEN_MEDIA(context, message);
    expect(context.commit).toHaveBeenCalledWith('SET_MEDIA_VIEW', message);
  });

  it('CLOSE_MEDIA commits SET_MEDIA_VIEW mutation with null value', () => {
    chatModule.actions.CLOSE_MEDIA(context);
    expect(context.commit).toHaveBeenCalledWith('SET_MEDIA_VIEW', null);
  });

  it('INITIALIZE_CHAT_PLAYERS sets array with passed player to chatOnWorkspace in state', () => {
    const player = { jest: 1 };
    expect(chatOnWorkspace.players).toBeFalsy();
    chatModule.actions.INITIALIZE_CHAT_PLAYERS(context, { player });
    expect(chatOnWorkspace.players).toEqual([player]);
  });

  it('CLEAN_CHAT_PLAYERS removes chat.players property', () => {
    chatOnWorkspace.players = ['jest'];
    chatModule.actions.CLEAN_CHAT_PLAYERS(context);
    expect(chatOnWorkspace.players).toBe(undefined);
  });

  it('ATTACH_PLAYER_TO_CHAT dispatches INITIALIZE_CHAT_PLAYERS if chatOnWorkspace has no players', () => {
    const player = { on: vi.fn() };
    chatModule.actions.ATTACH_PLAYER_TO_CHAT(context, { player });
    expect(context.dispatch).toHaveBeenCalledWith('INITIALIZE_CHAT_PLAYERS', { player, chat: chatOnWorkspace });
  });

  it('ATTACH_PLAYER_TO_CHAT sets working watcher on player "play" event', () => {
    let callback;
    const player = {
      on: (event, _callback) => {
        callback = _callback;
      },
    };
    chatModule.actions.ATTACH_PLAYER_TO_CHAT(context, { player });
    callback();
    expect(context.dispatch).toHaveBeenCalledWith('PAUSE_ALL_CHAT_PLAYERS_EXCEPT', { player });
  });

  it('PAUSE_ALL_CHAT_PLAYERS_EXCEPT triggers player.pause() on all players in chatOnWorkspace (except the passed one)', () => {
    const player = { pause: vi.fn(), id: 1 };
    const player2 = { pause: vi.fn(), id: 2 };
    chatOnWorkspace.players = [player, player2];
    chatModule.actions.PAUSE_ALL_CHAT_PLAYERS_EXCEPT(context, { player });
    expect(player.pause).not.toHaveBeenCalled();
    expect(player2.pause).toHaveBeenCalled();
  });
});

