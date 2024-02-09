import clientHandlers from '../client-handlers';
import MockSocket from '../../../../../tests/unit/mocks/MockSocket';
import usersAPIRepository from '../../../../app/api/agent-workspace/endpoints/users/UsersAPIRepository';
import webSocketClientController
  from '../../../../app/api/agent-workspace/websocket/WebSocketClientController';

let mockSocket = new MockSocket();

vi.spyOn(webSocketClientController, 'getCliInstance').mockImplementation(() => mockSocket);

const agent = { agentId: '1' };

describe('features/status store client handlers: actions', () => {
  const context = {
    rootState: { client: webSocketClientController },
    dispatch: vi.fn(),
    commit: vi.fn(),
  };

  beforeEach(() => {
    mockSocket = new MockSocket();
    context.dispatch.mockClear();
    context.commit.mockClear();
  });

  it('SUBSCRIBE_STATUS dispatches both SUBSCRIBE_AGENT_STATUS and SUBSCRIBE_USER_STATUS', () => {
    clientHandlers.actions.SUBSCRIBE_STATUS(context);
    expect(context.dispatch.mock.calls[0]).toEqual(['SUBSCRIBE_AGENT_STATUS']);
    expect(context.dispatch.mock.calls[1]).toEqual(['SUBSCRIBE_USER_STATUS']);
  });

  it('SUBSCRIBE_AGENT_STATUS calls agentSession() and subscribes to agent status', async () => {
    mockSocket.agentSession = vi.fn(() => agent);
    mockSocket.subscribeAgentsStatus = vi.fn();
    await clientHandlers.actions.SUBSCRIBE_AGENT_STATUS(context);
    expect(mockSocket.agentSession).toHaveBeenCalled();
    expect(mockSocket.subscribeAgentsStatus).toHaveBeenCalled();
  });

  it('after SUBSCRIBE_AGENT_STATUS, at agentStatus change commits SET_AGENT_INSTANCE with this agent', async () => {
    await clientHandlers.actions.SUBSCRIBE_AGENT_STATUS(context);
    mockSocket.changeAgentStatus(null, agent);
    expect(context.commit).toHaveBeenCalledWith('SET_AGENT_INSTANCE', agent);
  });

  it('SUBSCRIBE_AGENT_STATUS does commit agent object', async () => {
    const agent = {};
    mockSocket.agentSession = vi.fn(() => agent);
    mockSocket.subscribeAgentsStatus = vi.fn();
    await clientHandlers.actions.SUBSCRIBE_AGENT_STATUS(context);
    expect(mockSocket.agentSession).toHaveBeenCalled();
    expect(context.commit).toHaveBeenCalledWith('SET_AGENT_INSTANCE', agent);
  });

  it('if SUBSCRIBE_AGENT_STATUS agentSession throws error, doesnt commit agent change', async () => {
    mockSocket.agentSession = vi.fn(() => throwError('msg'));
    mockSocket.subscribeAgentsStatus = vi.fn();
    await clientHandlers.actions.SUBSCRIBE_AGENT_STATUS(context);
    expect(mockSocket.agentSession).toHaveBeenCalled();
    expect(context.commit).not.toHaveBeenCalled();
  });

  it('SUBSCRIBE_USER_STATUS calls subscribeUsersStatus() and dispatches GET_CURRENT_USER_STATUS', async () => {
    mockSocket.subscribeUsersStatus = vi.fn(() => agent);
    await clientHandlers.actions.SUBSCRIBE_USER_STATUS(context);
    expect(mockSocket.subscribeUsersStatus).toHaveBeenCalled();
    expect(context.dispatch).toHaveBeenCalledWith('GET_CURRENT_USER_STATUS');
  });

  it('GET_CURRENT_USER_STATUS calls getUserStatus() API', async () => {
    const getUserStatusMock = vi.fn();
    usersAPIRepository.getUserStatus = getUserStatusMock;
    await clientHandlers.actions.GET_CURRENT_USER_STATUS(context);
    expect(getUserStatusMock).toHaveBeenCalled();
  });
});
