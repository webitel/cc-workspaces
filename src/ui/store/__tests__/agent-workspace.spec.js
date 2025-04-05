import instance from '../../../app/api/instance';
import workspaceModule from '../agent-workspace';
import WorkspaceStates from '../../enums/WorkspaceState.enum';
import webSocketClientController from '../../../app/api/agent-workspace/websocket/WebSocketClientController';

const destroyCliInstanceMock = vi.fn();

vi.spyOn(webSocketClientController, 'destroyCliInstance')
  .mockImplementation(destroyCliInstanceMock);

describe('workspace store: actions', () => {
  const context = {
    state: {
      stateHistory: [],
    },
    rootState: { client: webSocketClientController },
    dispatch: vi.fn(),
    commit: vi.fn(),
  };

  beforeEach(() => {
    context.state = {
      stateHistory: [],
    };
    context.dispatch.mockClear();
    context.commit.mockClear();
  });

  it('OPEN_SESSION dispatches userinfo/OPEN_SESSION (restores user data)', async () => {
    await workspaceModule.actions.OPEN_SESSION(context);
    expect(context.dispatch).toHaveBeenCalledWith('ui/userinfo/OPEN_SESSION', { instance }, { root: true });
  });

  it('OPEN_SESSION dispatches now/SET_NOW_WATCHER (inits reactive time)', async () => {
    await workspaceModule.actions.OPEN_SESSION(context);
    expect(context.dispatch).toHaveBeenCalledWith('ui/now/SET_NOW_WATCHER', null, { root: true });
  });

  it('OPEN_SESSION dispatches call/SUBSCRIBE_CALLS (subscribes to calls)', async () => {
    await workspaceModule.actions.OPEN_SESSION(context);
    expect(context.dispatch).toHaveBeenCalledWith('features/call/SUBSCRIBE_CALLS', null, { root: true });
  });

  it('OPEN_SESSION dispatches chat/SUBSCRIBE_CHATS (subscribes to chats)', async () => {
    await workspaceModule.actions.OPEN_SESSION(context);
    expect(context.dispatch).toHaveBeenCalledWith('features/chat/SUBSCRIBE_CHATS', null, { root: true });
  });

  it('OPEN_SESSION dispatches status/SUBSCRIBE_STATUS (subscribes to agent status)', async () => {
    await workspaceModule.actions.OPEN_SESSION(context);
    expect(context.dispatch).toHaveBeenCalledWith('features/status/SUBSCRIBE_STATUS', null, { root: true });
  });

  it('OPEN_SESSION dispatches call/missed/LOAD_DATA_LIST (loads missed calls list)', async () => {
    await workspaceModule.actions.OPEN_SESSION(context);
    expect(context.dispatch).toHaveBeenCalledWith('features/call/missed/LOAD_DATA_LIST', null, { root: true });
  });

  it('OPEN_SESSION dispatches member/LOAD_DATA_LIST (loads offline queue members)', async () => {
    await workspaceModule.actions.OPEN_SESSION(context);
    expect(context.dispatch).toHaveBeenCalledWith('features/member/LOAD_DATA_LIST', null, { root: true });
  });

  it('CLOSE_SESSION dispatches now/CLEAR_NOW_WATCHER (clears reactive time watcher)', () => {
    workspaceModule.actions.CLOSE_SESSION(context);
    expect(context.dispatch).toHaveBeenCalledWith('ui/now/CLEAR_NOW_WATCHER', null, { root: true });
  });

  it('CLOSE_SESSION calls calls destroy cli instance method', () => {
    workspaceModule.actions.CLOSE_SESSION(context);
    expect(destroyCliInstanceMock).toHaveBeenCalled();
  });

  it('SET_WORKSPACE_STATE commits ADD_WORKSPACE_STATE with passed state', () => {
    const task = {};
    workspaceModule.actions.SET_WORKSPACE_STATE(context, { type: WorkspaceStates.CALL, task });
    expect(context.commit).toHaveBeenCalledWith('ADD_WORKSPACE_STATE', { type: WorkspaceStates.CALL, task });
  });

  it('RESET_WORKSPACE_STATE commits SET_STATE_HISTORY with empty array, if init length is 0 too', () => {
    context.state.stateHistory = [];
    workspaceModule.actions.RESET_WORKSPACE_STATE(context);
    expect(context.commit).toHaveBeenCalledWith('SET_STATE_HISTORY', []);
  });
});

describe('workspace store: mutations', () => {
  it('SET_WORKSPACE_STATE sets passed value to workspaceState state prop', () => {
    const state = { stateHistory: [] };
    const task = {};
    const _state = { type: WorkspaceStates.CALL, task };
    workspaceModule.mutations.ADD_WORKSPACE_STATE(state, _state);
    expect(state.stateHistory).toEqual([_state]);
  });
  it('SET_STATE_HISTORY sets passed value to state', () => {
    const state = { stateHistory: [] };
    const stateHistory = [1, 2, 3];
    workspaceModule.mutations.SET_STATE_HISTORY(state, stateHistory);
    expect(state.stateHistory).toBe(stateHistory);
  });
});
