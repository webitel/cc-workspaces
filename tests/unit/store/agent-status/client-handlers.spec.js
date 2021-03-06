import clientHandlers from '../../../../src/store/modules/agent-status/client-handlers';
import MockSocket from '../../mocks/MockSocket';
import usersAPIRepository from '../../../../src/api/agent-workspace/users/UsersAPIRepository';

let mockSocket = new MockSocket();
jest.mock('../../../../src/api/agent-workspace/call-ws-connection',
  () => ({ getCliInstance: () => mockSocket }));

const agent = { agentId: '1' };

describe('status store client handlers: actions', () => {
  const context = {
    dispatch: jest.fn(),
    commit: jest.fn(),
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
    mockSocket.agentSession = jest.fn(() => agent);
    mockSocket.subscribeAgentsStatus = jest.fn();
    await clientHandlers.actions.SUBSCRIBE_AGENT_STATUS(context);
    expect(mockSocket.agentSession).toHaveBeenCalled();
    expect(mockSocket.subscribeAgentsStatus).toHaveBeenCalled();
  });

  it('after SUBSCRIBE_AGENT_STATUS, at agentStatus change commits SET_AGENT_INSTANCE with this agent', async () => {
    await clientHandlers.actions.SUBSCRIBE_AGENT_STATUS(context);
    mockSocket.changeAgentStatus(null, agent);
    expect(context.commit).toHaveBeenCalledWith('SET_AGENT_INSTANCE', agent);
  });

  it('SUBSCRIBE_USER_STATUS calls subscribeUsersStatus() and dispatches GET_CURRENT_USER_STATUS', async () => {
    mockSocket.subscribeUsersStatus = jest.fn(() => agent);
    await clientHandlers.actions.SUBSCRIBE_USER_STATUS(context);
    expect(mockSocket.subscribeUsersStatus).toHaveBeenCalled();
    expect(context.dispatch).toHaveBeenCalledWith('GET_CURRENT_USER_STATUS');
  });

  it('GET_CURRENT_USER_STATUS calls getUserStatus() API', async () => {
    const getUserStatusMock = jest.fn();
    usersAPIRepository.getUserStatus = getUserStatusMock;
    await clientHandlers.actions.GET_CURRENT_USER_STATUS(context);
    expect(getUserStatusMock).toHaveBeenCalled();
  });
});
