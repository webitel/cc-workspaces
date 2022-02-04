import callModule from '../../../../src/store/modules/call/call';

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

  it('empty test', () => {
    expect(callModule).toBeTruthy();
  });
});
