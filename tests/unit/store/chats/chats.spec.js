import chatModule from '../../../../src/store/modules/chat/chat';
import WorkspaceStates from '../../../../src/store/modules/agent-workspace/workspaceUtils/WorkspaceStates';

const chat = {
  id: '1',
  join: jest.fn(),
  decline: jest.fn(),
  leave: jest.fn(),
  send: jest.fn(),
  sendText: jest.fn(),
};

describe('chat store: actions', () => {
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
    context.dispatch.mockClear();
    context.commit.mockClear();
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
});

describe('chat store: mutations', () => {
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
