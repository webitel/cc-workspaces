import chatModule from '../../../../src/store/modules/chat/chat';
import MockSocket from '../../mocks/MockSocket';
import webSocketClientController
  from '../../../../src/api/agent-workspace/WebSocketClientController';

let mockSocket = new MockSocket();

jest.spyOn(webSocketClientController, 'getCliInstance').mockImplementation(() => mockSocket);

const chat = { id: '1' };

describe('chat store client handlers: actions', () => {
  const context = {
    rootState: { client: webSocketClientController },
    dispatch: jest.fn(),
    commit: jest.fn(),
    rootGetters: { 'workspace/IS_EMPTY_WORKSPACE': null },
  };

  beforeEach(() => {
    mockSocket = new MockSocket();
    context.dispatch.mockClear();
    context.commit.mockClear();
  });

  it('SUBSCRIBE_CHATS subscribes to chats', async () => {
    const subscribeChatMock = jest.fn();
    mockSocket.subscribeChat = subscribeChatMock;
    await chatModule.actions.SUBSCRIBE_CHATS(context, chat);
    expect(subscribeChatMock).toHaveBeenCalled();
  });

  it('HANDLE_INVITE_ACTION is called after Invite event', async () => {
    await chatModule.actions.SUBSCRIBE_CHATS(context, chat);
    mockSocket.invite(chat);
    expect(context.dispatch).toHaveBeenCalledWith('HANDLE_INVITE_ACTION', chat);
  });

  it('HANDLE_MESSAGE_ACTION is called after Message event', async () => {
    await chatModule.actions.SUBSCRIBE_CHATS(context, chat);
    mockSocket.message(chat);
    expect(context.dispatch).toHaveBeenCalledWith('HANDLE_MESSAGE_ACTION', chat);
  });

  it('HANDLE_MESSAGE_ACTION dispatches CHAT_INSERT_TO_START with passed message', async () => {
    await chatModule.actions.HANDLE_MESSAGE_ACTION(context, chat);
    expect(context.dispatch).lastCalledWith('CHAT_INSERT_TO_START', chat);
  });

  it('HANDLE_DESTROY_ACTION is called after Destroy event', async () => {
    await chatModule.actions.SUBSCRIBE_CHATS(context, chat);
    mockSocket.destroy(chat);
    expect(context.dispatch).toHaveBeenCalledWith('HANDLE_DESTROY_ACTION', chat);
  });

  it('HANDLE_INVITE_ACTION commits ADD_CHAT mutation with invited chat', () => {
    chatModule.actions.HANDLE_INVITE_ACTION(context, chat);
    expect(context.dispatch).toHaveBeenCalledWith('ADD_CHAT', chat);
  });

  it('HANDLE_INVITE_ACTION calls SET_WORKSPACE with chat if no task on workspace', () => {
    context.rootGetters['workspace/IS_EMPTY_WORKSPACE'] = true;
    chatModule.actions.HANDLE_INVITE_ACTION(context, chat);
    expect(context.dispatch).toHaveBeenCalledWith('SET_WORKSPACE', chat);
  });

  it('HANDLE_INVITE_ACTION action does not call SET_WORKSPACE if something present in workspace', () => {
    context.rootGetters['workspace/IS_EMPTY_WORKSPACE'] = false;
    chatModule.actions.HANDLE_INVITE_ACTION(context, chat);
    expect(context.dispatch).not.toHaveBeenCalledWith('SET_WORKSPACE');
  });

  it('HANDLE_DESTROY_ACTION commits REMOVE_CHAT mutation with removed chat', () => {
    chatModule.actions.HANDLE_DESTROY_ACTION(context, chat);
    expect(context.commit).toHaveBeenCalledWith('REMOVE_CHAT', chat);
  });
});
