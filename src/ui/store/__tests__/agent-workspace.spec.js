import workspaceModule from '../agent-workspace';
import WorkspaceStates from '../../enums/WorkspaceState.enum';
import webSocketClientController from '../../../app/api/agent-workspace/websocket/WebSocketClientController';

const destroyCliInstanceMock = jest.fn();

jest.spyOn(webSocketClientController, 'destroyCliInstance')
  .mockImplementation(destroyCliInstanceMock);

describe('workspace store: actions', () => {
  const context = {
    rootState: { client: webSocketClientController },
    dispatch: jest.fn(),
    commit: jest.fn(),
  };

  beforeEach(() => {
    context.dispatch.mockClear();
    context.commit.mockClear();
  });

  it('OPEN_SESSION dispatches userinfo/OPEN_SESSION (restores user data)', async () => {
    await workspaceModule.actions.OPEN_SESSION(context);
    expect(context.dispatch).toHaveBeenCalledWith('ui/userinfo/OPEN_SESSION', null, { root: true });
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

  it('SET_WORKSPACE_STATE commits SET_WORKSPACE_STATE with passed state', () => {
    workspaceModule.actions.SET_WORKSPACE_STATE(context, WorkspaceStates.CALL);
    expect(context.commit).toHaveBeenCalledWith('SET_WORKSPACE_STATE', WorkspaceStates.CALL);
  });

  it('RESET_WORKSPACE_STATE commits SET_WORKSPACE_STATE with empty value', () => {
    workspaceModule.actions.RESET_WORKSPACE_STATE(context);
    expect(context.commit).toHaveBeenCalledWith('SET_WORKSPACE_STATE', null);
  });
});

describe('workspace store: actions', () => {
  it('SET_WORKSPACE_STATE sets passed value to workspaceState state prop', () => {
    const state = { workspaceState: null };
    workspaceModule.mutations.SET_WORKSPACE_STATE(state, WorkspaceStates.CALL);
    expect(state.workspaceState).toBe(WorkspaceStates.CALL);
  });
});
