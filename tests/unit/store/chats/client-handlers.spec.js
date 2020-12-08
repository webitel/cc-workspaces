import chatModule from '../../../../src/store/modules/chat/chat';
import MockSocket from '../../mocks/MockSocket';

let mockSocket = new MockSocket();
jest.mock('../../../../src/api/agent-workspace/call-ws-connection',
  () => ({ getCliInstance: () => mockSocket }));

const chat = { id: '1' };

describe('chat store client handlers: actions', () => {
  const context = {
    dispatch: jest.fn(),
    commit: jest.fn(),
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

  it('HANDLE_CLOSE_ACTION is called after Leave event', async () => {
    await chatModule.actions.SUBSCRIBE_CHATS(context, chat);
    mockSocket.leave(chat);
    expect(context.dispatch).toHaveBeenCalledWith('HANDLE_CLOSE_ACTION', chat);
  });

  it('HANDLE_CLOSE_ACTION is called after Decline event', async () => {
    await chatModule.actions.SUBSCRIBE_CHATS(context, chat);
    mockSocket.decline(chat);
    expect(context.dispatch).toHaveBeenCalledWith('HANDLE_CLOSE_ACTION', chat);
  });

  it('HANDLE_CLOSE_ACTION is called after Close event', async () => {
    await chatModule.actions.SUBSCRIBE_CHATS(context, chat);
    mockSocket.close(chat);
    expect(context.dispatch).toHaveBeenCalledWith('HANDLE_CLOSE_ACTION', chat);
  });

  it('HANDLE_INVITE_ACTION commits ADD_CHAT mutation with invited chat', () => {
    chatModule.actions.HANDLE_INVITE_ACTION(context, chat);
    expect(context.commit).toHaveBeenCalledWith('ADD_CHAT', chat);
  });

  it('HANDLE_CLOSE_ACTION commits REMOVE_CHAT mutation with removed chat', () => {
    chatModule.actions.HANDLE_CLOSE_ACTION(context, chat);
    expect(context.commit).toHaveBeenCalledWith('REMOVE_CHAT', chat);
  });
});
