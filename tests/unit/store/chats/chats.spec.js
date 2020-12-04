import chatModule from '../../../../src/store/modules/chat/chat';
import WorkspaceStates from '@/store/modules/agent-workspace/workspaceUtils/WorkspaceStates';

const chat = {
  id: '1',
  join: jest.fn(),
  decline: jest.fn(),
  leave: jest.fn(),
  sendText: jest.fn(),
};

describe('chat store: actions', () => {
  const context = {
    state: { chatOnWorkspace: chat },
    dispatch: jest.fn(),
    commit: jest.fn(),
  };

  beforeEach(() => {
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

  it('SEND action calls chat sendText() method', () => {
    const message = 'jest';
    chatModule.actions.SEND(context, message);
    expect(chat.sendText).toHaveBeenCalledWith(message);
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
});
