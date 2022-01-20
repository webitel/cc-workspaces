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
});
