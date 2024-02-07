import callModule from '../call';

const call = {
  id: '1',
};

describe('features/call store: actions', () => {
  const context = {
    state: { callOnWorkspace: call },
    dispatch: vi.fn(),
    commit: vi.fn(),
    rootGetters: { 'workspace/IS_EMPTY_WORKSPACE': null },
    rootState: {
      config: {
        CLI: {},
      },
    },
  };

  beforeEach(() => {
    context.state = { callOnWorkspace: call };
    context.dispatch.mockClear();
    context.commit.mockClear();
  });

  it('empty test', () => {
    expect(callModule).toBeTruthy();
  });

  it('HANDLE_RINGING_ACTION action calls SET_WORKSPACE with call if no task on workspace', () => {
    context.rootGetters['workspace/IS_EMPTY_WORKSPACE'] = true;
    callModule.actions.HANDLE_RINGING_ACTION(context, call);
    expect(context.dispatch).toHaveBeenCalledWith('SET_WORKSPACE', call);
  });

  it('HANDLE_RINGING_ACTION action does not call SET_WORKSPACE if something present in workspace', () => {
    context.rootGetters['workspace/IS_EMPTY_WORKSPACE'] = false;
    callModule.actions.HANDLE_RINGING_ACTION(context, call);
    expect(context.dispatch).not.toHaveBeenCalledWith('SET_WORKSPACE');
  });
  it('CALL action calls to number in prior to passed user or newNumber', async () => {
    const call = vi.fn();
    const number = 'number';
    const user = { extension: 'extension' };
    context.rootState.client = { getCliInstance: () => ({ call }) };
    context.rootGetters['workspace/TASK_ON_WORKSPACE'] = { newNumber: 'newNumber' };

    await callModule.actions.CALL(context, { number, user });
    expect(call.mock.calls[0][0].destination).toBe(number);
  });
  it('CALL action calls to user in prior to newNumber', async () => {
    const call = vi.fn();
    const user = { extension: 'extension' };
    context.rootState.client = { getCliInstance: () => ({ call }) };
    context.rootGetters['workspace/TASK_ON_WORKSPACE'] = { newNumber: 'newNumber' };

    await callModule.actions.CALL(context, { user });
    expect(call.mock.calls[0][0].destination).toBe('extension');
  });
  it('CALL action with no passed params calls to newNumber', async () => {
    const call = vi.fn();
    context.rootState.client = { getCliInstance: () => ({ call }) };
    context.rootGetters['workspace/TASK_ON_WORKSPACE'] = { newNumber: 'newNumber' };

    await callModule.actions.CALL(context, {});
    expect(call.mock.calls[0][0].destination).toBe('newNumber');
  });
});
