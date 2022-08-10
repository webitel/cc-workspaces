import ChatTransferDestination from '../../../../../ui/modules/work-section/modules/chat/enums/ChatTransferDestination.enum';
import WorkspaceStates from '../../../../../ui/enums/WorkspaceState.enum';
import chatModule from '../chat';

const chat = {
  id: '1',
  join: jest.fn(),
  decline: jest.fn(),
  leave: jest.fn(),
  send: jest.fn(),
  sendText: jest.fn(),
  transferToUser: jest.fn(),
  transferToPlan: jest.fn(),
};

describe('features/chat store: actions', () => {
  const context = {
    state: { chatOnWorkspace: chat },
    dispatch: jest.fn(),
    commit: jest.fn(),
  };

  beforeEach(() => {
    context.state = { chatOnWorkspace: chat };
    chat.join.mockClear();
    chat.leave.mockClear();
    chat.decline.mockClear();
    chat.transferToUser.mockClear();
    chat.transferToPlan.mockClear();
    context.dispatch.mockClear();
    context.commit.mockClear();
  });

  it('ACCEPT action calls chat join() method', () => {
    chatModule.actions.ACCEPT(context);
    expect(chat.join).toHaveBeenCalled();
  });

  it('ACCEPT action calls chat join() method', () => {
    chatModule.actions.ACCEPT(context);
    expect(chat.join).toHaveBeenCalled();
  });

  it('SEND action calls chat send() method', () => {
    const message = 'jest';
    chatModule.actions.SEND(context, message);
    expect(chat.send).toHaveBeenCalledWith(message);
  });

  it('SEND_FILE action calls chat send() method, if 1 file is passed', () => {
    const file = { name: 'jest1' };
    chatModule.actions.SEND_FILE(context, file);
    expect(context.dispatch).toHaveBeenCalledWith('SEND', file);
  });

  it('SEND_FILE action calls chat send() method, for each passed file in array', () => {
    const files = [{ name: 'jest1' }, { name: 'jest2' }];
    chatModule.actions.SEND_FILE(context, files);
    expect(context.dispatch).toHaveBeenCalledTimes(files.length);
    expect(context.dispatch.mock.calls[0]).toEqual(['SEND', files[0]]);
    expect(context.dispatch.mock.calls[1]).toEqual(['SEND', files[1]]);
  });

  it('TRANSFER action calls chat transferToUser() method is passed destination is USER', () => {
    const id = 'jest';
    const payload = { destination: ChatTransferDestination.USER, item: { id } };
    chatModule.actions.TRANSFER(context, payload);
    expect(chat.transferToUser).toHaveBeenCalledWith(id);
  });

  it('TRANSFER action calls chat transferToPlan() method is passed destination is CHATPLAN', () => {
    const id = 'jest';
    const payload = { destination: ChatTransferDestination.CHATPLAN, item: { id } };
    chatModule.actions.TRANSFER(context, payload);
    expect(chat.transferToPlan).toHaveBeenCalledWith(id);
  });

  it('CLOSE action calls chat leave() method, if allowLeave is true', () => {
    chat.allowLeave = true;
    chatModule.actions.CLOSE(context);
    expect(chat.leave).toHaveBeenCalled();
  });

  it('CLOSE action calls chat decline() method', () => {
    chat.allowLeave = false;
    chatModule.actions.CLOSE(context);
    expect(chat.decline).toHaveBeenCalled();
  });

  it('OPEN_CHAT dispatches SET_WORKSPACE action with passed chat as param', () => {
    chatModule.actions.OPEN_CHAT(context, chat);
    expect(context.dispatch).toHaveBeenCalledWith('SET_WORKSPACE', chat);
  });

  it('CHAT_INSERT_TO_START changes passed chat position to start in chatList array', () => {
    const oldChat = { id: '1' };
    const updatedChat = { id: '2' };
    const oldChatList = [oldChat, updatedChat];
    const updatedChatList = [updatedChat, oldChat];
    context.state.chatList = oldChatList;
    chatModule.actions.CHAT_INSERT_TO_START(context, updatedChat);
    expect(context.commit).toHaveBeenCalledWith('SET_CHAT_LIST', updatedChatList);
  });

  it('SET_WORKSPACE dispatches global SET_WORKSPACE_STATE action', () => {
    chatModule.actions.SET_WORKSPACE(context, chat);
    expect(context.dispatch).toHaveBeenCalledWith('workspace/SET_WORKSPACE_STATE', WorkspaceStates.CHAT, { root: true });
  });

  it('SET_WORKSPACE commits local SET_WORKSPACE with passed chat', () => {
    chatModule.actions.SET_WORKSPACE(context, chat);
    expect(context.commit).toHaveBeenCalledWith('SET_WORKSPACE', chat);
  });

  it('RESET_WORKSPACE dispatches global SET_WORKSPACE_STATE action', () => {
    chatModule.actions.RESET_WORKSPACE(context);
    expect(context.dispatch).toHaveBeenCalledWith('workspace/RESET_WORKSPACE_STATE', null, { root: true });
  });

  it('RESET_WORKSPACE commits local SET_WORKSPACE with empty object', () => {
    chatModule.actions.RESET_WORKSPACE(context);
    expect(context.commit).toHaveBeenCalledWith('SET_WORKSPACE', {});
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

  it('HANDLE_CHAT_EVENT action dispatches global HANDLE_CHAT_EVENT action with action and chat params', () => {
    const action = 'message';
    chatModule.actions.HANDLE_CHAT_EVENT(context, { action, chat });
    expect(context.dispatch).toHaveBeenCalledWith('features/notifications/HANDLE_CHAT_EVENT', { action, chat }, { root: true });
  });

  it('_RESET_UNREAD_COUNT action dispatches global _RESET_UNREAD_COUNT action', () => {
    chatModule.actions._RESET_UNREAD_COUNT(context);
    expect(context.dispatch).toHaveBeenCalledWith('features/notifications/_RESET_UNREAD_COUNT', null, { root: true });
  });

  it('INITIALIZE_CHAT_PLAYERS sets array with passed player to chatOnWorkspace in state', () => {
    const player = { jest: 1 };
    expect(context.state.chatOnWorkspace.players).toBeFalsy();
    chatModule.actions.INITIALIZE_CHAT_PLAYERS(context, { player });
    expect(context.state.chatOnWorkspace.players).toEqual([player]);
  });

  it('CLEAN_CHAT_PLAYERS removes chat.players property', () => {
    context.state.chatOnWorkspace.players = ['jest'];
    chatModule.actions.CLEAN_CHAT_PLAYERS(context);
    expect(context.state.chatOnWorkspace.players).toBe(undefined);
  });

  it('ATTACH_PLAYER_TO_CHAT dispatches INITIALIZE_CHAT_PLAYERS if chatOnWorkspace has no players', () => {
    const player = { on: jest.fn() };
    chatModule.actions.ATTACH_PLAYER_TO_CHAT(context, { player });
    expect(context.dispatch).toHaveBeenCalledWith('INITIALIZE_CHAT_PLAYERS', { player, chat: context.state.chatOnWorkspace });
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
    const player = { pause: jest.fn() };
    const player2 = { pause: jest.fn() };
    context.state.chatOnWorkspace.players = [player, player2];
    chatModule.actions.PAUSE_ALL_CHAT_PLAYERS_EXCEPT(context, { player });
    expect(player.pause).not.toHaveBeenCalled();
    expect(player2.pause).toHaveBeenCalled();
  });
});

describe('features/chat store: mutations', () => {
  it('SET_CHAT_LIST sets chatList to state', () => {
    const chatList = [chat];
    const state = { chatList: [] };
    chatModule.mutations.SET_CHAT_LIST(state, chatList);
    expect(state.chatList).toEqual(chatList);
  });

  it('ADD_CHAT pushes new chat to chatList', () => {
    const chatList = [chat];
    const state = { chatList: [] };
    chatModule.mutations.ADD_CHAT(state, chat);
    expect(state.chatList).toEqual(chatList);
  });

  it('REMOVE_CHAT removes existing chat from chatList', () => {
    const chatList = [];
    const state = { chatList: [chat] };
    chatModule.mutations.REMOVE_CHAT(state, chat);
    expect(state.chatList).toEqual(chatList);
  });

  it('SET_WORKSPACE sets passed chat to chatOnWorkspace state prop', () => {
    const chatOnWorkspace = chat;
    const state = { chatOnWorkspace: {} };
    chatModule.mutations.SET_WORKSPACE(state, chat);
    expect(state.chatOnWorkspace).toEqual(chatOnWorkspace);
  });

  it('SET_MEDIA_VIEW sets passed message to mediaView state prop', () => {
    const message = { id: '1' };
    const mediaView = message;
    const state = { mediaView: {} };
    chatModule.mutations.SET_MEDIA_VIEW(state, message);
    expect(state.mediaView).toEqual(mediaView);
  });
});
