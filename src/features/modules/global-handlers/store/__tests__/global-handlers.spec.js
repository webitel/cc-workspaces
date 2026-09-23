import { nextTick, reactive } from 'vue';
import MockSocket from '../../../../../../tests/unit/mocks/MockSocket';
import { useWebSocketClient } from '../../../../../app/api/agent-workspace/websocket/useWebSocketClient';
import { WebSocketConnectionState } from '../../../../../ui/enums/WebSocketConnectionState.enum';
import globalsModule from '../global-handlers';

const mockSocket = new MockSocket();
const webSocketClientController = useWebSocketClient();

vi.spyOn(webSocketClientController, 'getCliInstance').mockImplementation(
	() => mockSocket,
);

describe('global handlers store: actions', () => {
	const context = {
		state: {},
		rootState: {
			client: webSocketClientController,
		},
		dispatch: vi.fn(),
		commit: vi.fn(),
	};

	beforeEach(() => {
		context.dispatch.mockClear();
		context.commit.mockClear();
	});

	it('INIT_GLOBAL_HANDLERS dispatches SUBSCRIBE_TO_CLIENT_DISCONNECT', () => {
		globalsModule.actions.INIT_GLOBAL_HANDLERS(context);
		expect(context.dispatch).toHaveBeenCalledWith(
			'SUBSCRIBE_TO_CLIENT_DISCONNECT',
		);
	});

	it(`SUBSCRIBE_TO_CLIENT_DISCONNECT subscription dispatches OPEN_DISCONNECT_POPUP
   on "disconnected" event`, async () => {
		globalsModule.actions.SUBSCRIBE_TO_CLIENT_DISCONNECT(context);
		await setTimeout(() => {}, 0); // wait for async getCliInstance()
		expect(context.dispatch).toHaveBeenCalledWith('OPEN_DISCONNECT_POPUP');
	});

	it(`SUBSCRIBE_TO_PHONE_REGISTRATION subscription commits SET_PHONE_REG
   on "phone_registered" event`, async () => {
		await globalsModule.actions.SUBSCRIBE_TO_PHONE_REGISTRATION(context);
		await setTimeout(() => {}, 0); // wait for async getCliInstance()
		expect(context.commit).toHaveBeenCalledWith(
			'SET_PHONE_REG',
			'phone_registered',
		);
	});

	it('SUBSCRIBE_TO_CONNECTION_STATE dispatches RESUBSCRIBE_AFTER_RECONNECT after reconnect cycle', async () => {
		const rootState = reactive({
			client: {
				state: WebSocketConnectionState.Idle,
				getClientSync: () => mockSocket,
			},
		});
		const stateContext = {
			...context,
			rootState,
		};
		const stop =
			globalsModule.actions.SUBSCRIBE_TO_CONNECTION_STATE(stateContext);
		const setState = async (value) => {
			rootState.client.state = value;
			await nextTick();
		};

		await setState(WebSocketConnectionState.Connecting);
		await setState(WebSocketConnectionState.Connected);
		expect(context.dispatch).not.toHaveBeenCalledWith(
			'RESUBSCRIBE_AFTER_RECONNECT',
		);

		await setState(WebSocketConnectionState.Reconnecting);
		await setState(WebSocketConnectionState.Disconnected);
		await setState(WebSocketConnectionState.Connecting);
		await setState(WebSocketConnectionState.Connected);
		expect(context.dispatch).toHaveBeenCalledWith(
			'RESUBSCRIBE_AFTER_RECONNECT',
		);

		stop();
	});

	it('RESUBSCRIBE_AFTER_RECONNECT re-subscribes status before other client subscriptions', async () => {
		await globalsModule.actions.RESUBSCRIBE_AFTER_RECONNECT(context);
		const dispatched = context.dispatch.mock.calls.map(([action]) => action);
		expect(dispatched[0]).toBe('features/status/SUBSCRIBE_STATUS');
		expect(dispatched).toEqual(
			expect.arrayContaining([
				'SUBSCRIBE_TO_PHONE_REGISTRATION',
				'SUBSCRIBE_TO_CLIENT_DISCONNECT',
				'SUBSCRIBE_TO_CLIENT_CLOSED',
				'features/call/SUBSCRIBE_CALLS',
				'features/chat/SUBSCRIBE_CHATS',
				'features/job/SUBSCRIBE_JOBS',
			]),
		);
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
		const state = {
			isDisconnectPopup: false,
		};
		globalsModule.mutations.SET_DISCONNECT_POPUP(state, value);
		expect(state.isDisconnectPopup).toEqual(value);
	});
	it('SET_PHONE_REG sets passed value to state isPhoneReg prop', () => {
		const value = true;
		const state = {
			isPhoneReg: false,
		};
		globalsModule.mutations.SET_PHONE_REG(state, value);
		expect(state.isPhoneReg).toEqual(value);
	});
});
