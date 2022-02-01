import callModule from '../../../../src/store/modules/call/call';
import Reporting from '../../../../src/store/modules/post-processing/Reporting';

const call = {
  id: '1',
};

describe('call store: actions', () => {
  const context = {
    state: { callOnWorkspace: call },
    dispatch: jest.fn(),
    commit: jest.fn(),
    getters: { 'workspace/TASK_ON_WORKSPACE': null },
  };

  beforeEach(() => {
    context.state = { callOnWorkspace: call };
    context.dispatch.mockClear();
    context.commit.mockClear();
  });

  it('SET_CALL_LIST action sets Reporting class object to passed call, if allowReporting is true', () => {
    const call = { hasReporting: true };
    const callList = [call];
    callModule.actions.SET_CALL_LIST(context, callList);
    expect(call.postProcessData instanceof Reporting).toBe(true);
  });

  it('ADD_CALL action sets Reporting class object to passed call, if allowReporting is true', () => {
    const call = { hasReporting: true };
    callModule.actions.ADD_CALL(context, call);
    expect(call.postProcessData instanceof Reporting).toBe(true);
  });

  it('HANDLE_RINGING_ACTION action calls SET_WORKSPACE with call if no task on workspace', () => {
    context.getters['workspace/TASK_ON_WORKSPACE'] = false;
    callModule.actions.HANDLE_RINGING_ACTION(context, call);
    expect(context.dispatch).toHaveBeenCalledWith('SET_WORKSPACE', call);
  });

  it('HANDLE_RINGING_ACTION action does not call SET_WORKSPACE if something present in workspace', () => {
    context.getters['workspace/TASK_ON_WORKSPACE'] = true;
    callModule.actions.HANDLE_RINGING_ACTION(context, call);
    expect(context.dispatch).not.toHaveBeenCalledWith('SET_WORKSPACE');
  });
});
