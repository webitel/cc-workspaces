import statusModule from '../../../../src/store/modules/agent-status/agent-status';
import MockSocket from '../../mocks/MockSocket';
import usersAPIRepository from '../../../../src/api/agent-workspace/users/UsersAPIRepository';

const { setUserStatus } = usersAPIRepository;

let mockSocket = new MockSocket();
jest.mock('../../../../src/api/agent-workspace/call-ws-connection',
  () => ({ getCliInstance: () => mockSocket }));
jest.mock('../../../../src/api/agent-workspace/users/UsersAPIRepository');

describe('status store client handlers: actions', () => {
  const agent = {
    agentId: '1',
    online: jest.fn(),
    pause: jest.fn(),
    offline: jest.fn(),
  };

  const context = {
    state: { agent },
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

  it('SET_USER_ACTIVE_STATUS calls setUserStatus API method with "" (empty string)', () => {
    const setUserStatusMock = jest.fn();
    usersAPIRepository.setUserStatus = setUserStatusMock;
    statusModule.actions.SET_USER_ACTIVE_STATUS(context);
    expect(setUserStatusMock).toHaveBeenCalledWith('');
  });

  it('SET_USER_DND_STATUS calls setUserStatus API method with "dnd"', () => {
    const setUserStatusMock = jest.fn();
    usersAPIRepository.setUserStatus = setUserStatusMock;
    statusModule.actions.SET_USER_DND_STATUS(context);
    expect(setUserStatusMock).toHaveBeenCalledWith('dnd');
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
