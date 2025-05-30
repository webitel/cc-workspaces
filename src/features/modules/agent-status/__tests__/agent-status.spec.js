import MockSocket from '../../../../../tests/unit/mocks/MockSocket';
import usersAPIRepository from '../../../../app/api/agent-workspace/endpoints/users/UsersAPIRepository';
import webSocketClientController
  from '../../../../app/api/agent-workspace/websocket/WebSocketClientController';
import statusModule from '../agent-status';
import UserStatus from '../statusUtils/UserStatus';

let mockSocket = new MockSocket();
vi.spyOn(webSocketClientController, 'getCliInstance')
  .mockImplementation(() => mockSocket);

describe('features/status store client handlers: actions', () => {
  const agent = {
    agentId: '1',
    online: vi.fn(),
    pause: vi.fn(),
    offline: vi.fn(),
  };

  const context = {
    state: { agent },
    rootState: { client: webSocketClientController },
    getters: {},
    dispatch: vi.fn(),
    commit: vi.fn(),
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
    const setUserStatusMock = vi.fn();
    usersAPIRepository.setUserStatus = setUserStatusMock;
    context.state.user = { status: { [UserStatus.DND]: true } };
    statusModule.actions.TOGGLE_USER_DND(context);
    expect(setUserStatusMock).toHaveBeenCalledWith('');
  });

  it('TOGGLE_USER_DND calls setUserStatus API method with \'dnd\', if current status is dnd', () => {
    const setUserStatusMock = vi.fn();
    usersAPIRepository.setUserStatus = setUserStatusMock;
    context.state.user = { status: UserStatus.ACTIVE };
    statusModule.actions.TOGGLE_USER_DND(context);
    expect(setUserStatusMock).toHaveBeenCalledWith(UserStatus.DND);
  });

  it('TOGGLE_CONTACT_CENTER_MODE dispatches AGENT_LOGOUT if IS_CCENTER_ON getter == true', async () => {
    context.getters.IS_CCENTER_ON = true;
    await statusModule.actions.TOGGLE_CONTACT_CENTER_MODE(context);
    expect(context.dispatch).toHaveBeenCalledWith('AGENT_LOGOUT');
  });

  it('TOGGLE_CONTACT_CENTER_MODE dispatches SET_AGENT_WAITING_STATUS if IS_CCENTER_ON getter == false', async () => {
    context.getters.IS_CCENTER_ON = false;
    await statusModule.actions.TOGGLE_CONTACT_CENTER_MODE(context);
    expect(context.dispatch).toHaveBeenCalledWith('SET_AGENT_WAITING_STATUS');
  });
});

describe('features/status store: mutations', () => {
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
