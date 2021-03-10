import globalsModule from '../../../../src/store/modules/global-handlers/global-handlers';
import MockSocket from '../../mocks/MockSocket';

const mockSocket = new MockSocket();
jest.mock('../../../../src/api/agent-workspace/call-ws-connection',
  () => ({ getCliInstance: () => mockSocket }));

describe('global handlers store: actions', () => {
  const context = {
    state: {},
    dispatch: jest.fn(),
    commit: jest.fn(),
  };

  beforeEach(() => {
    context.dispatch.mockClear();
    context.commit.mockClear();
  });

  it('INIT_GLOBAL_HANDLERS dispatches SUBSCRIBE_TO_CLIENT_DISCONNECT', () => {
    globalsModule.actions.INIT_GLOBAL_HANDLERS(context);
    expect(context.dispatch).toHaveBeenCalledWith('SUBSCRIBE_TO_CLIENT_DISCONNECT');
  });

  it(`SUBSCRIBE_TO_CLIENT_DISCONNECT subscription dispatches OPEN_DISCONNECT_POPUP
   on "disconnected" event`, async () => {
    globalsModule.actions.SUBSCRIBE_TO_CLIENT_DISCONNECT(context);
    await setTimeout(() => {}, 0); // wait for async getCliInstance()
    expect(context.dispatch).toHaveBeenCalledWith('OPEN_DISCONNECT_POPUP');
  });

  it('OPEN_DISCONNECT_POPUP commits SET_DISCONNECT_POPUP with "true" value', () => {
    globalsModule.actions.OPEN_DISCONNECT_POPUP(context);
    expect(context.commit).toHaveBeenCalledWith('SET_DISCONNECT_POPUP', true);
  });

  it('CLOSE_DISCONNECT_POPUP commits SET_DISCONNECT_POPUP with "close" value', () => {
    globalsModule.actions.CLOSE_DISCONNECT_POPUP(context);
    expect(context.commit).toHaveBeenCalledWith('SET_DISCONNECT_POPUP', false);
  });
});

describe('global handlers store: mutations', () => {
  it('SET_DISCONNECT_POPUP sets passed value to state isDisconnectPopup prop', () => {
    const value = true;
    const state = { isDisconnectPopup: false };
    globalsModule.mutations.SET_DISCONNECT_POPUP(state, value);
    expect(state.isDisconnectPopup).toEqual(value);
  });
});
