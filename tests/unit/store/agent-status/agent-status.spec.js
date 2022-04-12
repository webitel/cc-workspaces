import statusModule from '../../../../src/store/modules/agent-status/agent-status';
import UserStatus from '../../../../src/store/modules/agent-status/statusUtils/UserStatus';
import MockSocket from '../../mocks/MockSocket';
import usersAPIRepository from '../../../../src/api/agent-workspace/endpoints/users/UsersAPIRepository';
import webSocketClientController
  from '../../../../src/api/agent-workspace/websocket/WebSocketClientController';

let mockSocket = new MockSocket();
jest.spyOn(webSocketClientController, 'getCliInstance')
  .mockImplementation(() => mockSocket);
jest.mock('../../../../src/api/agent-workspace/endpoints/users/UsersAPIRepository');

describe('status store client handlers: actions', () => {
  const agent = {
    agentId: '1',
    online: jest.fn(),
    pause: jest.fn(),
    offline: jest.fn(),
  };

  const context = {
    state: { agent },
    rootState: { client: webSocketClientController },
    getters: {},
    dispatch: jest.fn(),
    commit: jest.fn(),
  };

  beforeEach(() => {
    mockSocket = new MockSocket();
    context.dispatch.mockClear();
    context.commit.mockClear();
  });

  it('SET_AGENT_WAITING_STATUS calls agent.online() method', () => {
    statusModule.actions.SET_AGENT_WAITING_STATUS(context);
    expect(agent.online).toHaveBeenCalled();
  });

  it('SET_AGENT_PAUSE_STATUS calls agent.pause() method', () => {
    statusModule.actions.SET_AGENT_PAUSE_STATUS(context);
    expect(agent.pause).toHaveBeenCalled();
  });

  it('AGENT_LOGOUT calls agent.offline() method', () => {
    statusModule.actions.AGENT_LOGOUT(context);
    expect(agent.offline).toHaveBeenCalled();
  });

  it('TOGGLE_USER_DND calls setUserStatus API method with \'\', if current status is dnd', () => {
    const setUserStatusMock = jest.fn();
    usersAPIRepository.setUserStatus = setUserStatusMock;
    context.state.user = { status: UserStatus.DND };
    statusModule.actions.TOGGLE_USER_DND(context);
    expect(setUserStatusMock).toHaveBeenCalledWith('');
  });

  it('TOGGLE_USER_DND calls setUserStatus API method with \'dnd\', if current status is dnd', () => {
    const setUserStatusMock = jest.fn();
    usersAPIRepository.setUserStatus = setUserStatusMock;
    context.state.user = { status: UserStatus.ACTIVE };
    statusModule.actions.TOGGLE_USER_DND(context);
    expect(setUserStatusMock).toHaveBeenCalledWith(UserStatus.DND);
  });

  it('TOGGLE_CONTACT_CENTER_MODE dispatches AGENT_LOGOUT if IS_AGENT getter == true', async () => {
    context.getters.IS_AGENT = true;
    await statusModule.actions.TOGGLE_CONTACT_CENTER_MODE(context);
    expect(context.dispatch).toHaveBeenCalledWith('AGENT_LOGOUT');
  });

  it('TOGGLE_CONTACT_CENTER_MODE dispatches SET_AGENT_WAITING_STATUS if IS_AGENT getter == false', async () => {
    context.getters.IS_AGENT = false;
    await statusModule.actions.TOGGLE_CONTACT_CENTER_MODE(context);
    expect(context.dispatch).toHaveBeenCalledWith('SET_AGENT_WAITING_STATUS');
  });
});

describe('status store: mutations', () => {
  it('SET_AGENT_INSTANCE sets passed agent to agent state prop', () => {
    const agent = { name: 'jest' };
    const state = { agent: {} };
    statusModule.mutations.SET_AGENT_INSTANCE(state, agent);
    expect(state.agent).toEqual(agent);
  });

  it('SET_USER_INSTANCE sets passed user to user state prop', () => {
    const user = { name: 'jest' };
    const state = { user: {} };
    statusModule.mutations.SET_USER_INSTANCE(state, user);
    expect(state.user).toEqual(user);
  });
});
