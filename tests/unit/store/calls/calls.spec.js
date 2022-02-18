import callModule from '../../../../src/store/modules/call/call';

const call = {
  id: '1',
};

describe('call store: actions', () => {
  const context = {
    state: { callOnWorkspace: call },
    dispatch: jest.fn(),
    commit: jest.fn(),
    rootGetters: { 'workspace/IS_EMPTY_WORKSPACE': null },
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
});
