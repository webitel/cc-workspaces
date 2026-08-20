import { nextTick, ref } from 'vue';

import MockSocket from '../../../../../../tests/unit/mocks/MockSocket';
import { useWebSocketClient } from '../../../../../app/api/agent-workspace/websocket/useWebSocketClient';
import { WebSocketConnectionState } from '../../../../../ui/enums/WebSocketConnectionState.enum.ts';
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

	it('INIT_GLOBAL_HANDLERS dispatches SUBSCRIBE_TO_PAGE_VISIBILITY', () => {
		globalsModule.actions.INIT_GLOBAL_HANDLERS(context);
		expect(context.dispatch).toHaveBeenCalledWith(
			'SUBSCRIBE_TO_PAGE_VISIBILITY',
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

	it('OPEN_DISCONNECT_POPUP commits SET_DISCONNECT_POPUP with "true" value', () => {
		globalsModule.actions.OPEN_DISCONNECT_POPUP(context);
		expect(context.commit).toHaveBeenCalledWith('SET_DISCONNECT_POPUP', true);
	});

	it('CLOSE_DISCONNECT_POPUP commits SET_DISCONNECT_POPUP with "close" value', () => {
		globalsModule.actions.CLOSE_DISCONNECT_POPUP(context);
		expect(context.commit).toHaveBeenCalledWith('SET_DISCONNECT_POPUP', false);
	});

	it('SUBSCRIBE_TO_CONNECTION_STATE does not resubscribe chats on the first Connected', async () => {
		const connectionState = ref(WebSocketConnectionState.Idle);
		const watchContext = {
			rootState: {
				client: {
					state: connectionState,
					getClientSync: () => ({}),
				},
			},
			dispatch: vi.fn(),
		};

		const stop =
			globalsModule.actions.SUBSCRIBE_TO_CONNECTION_STATE(watchContext);
		connectionState.value = WebSocketConnectionState.Connecting;
		await nextTick();
		connectionState.value = WebSocketConnectionState.Connected;
		await nextTick();

		expect(watchContext.dispatch).not.toHaveBeenCalledWith(
			'features/chat/SUBSCRIBE_CHATS',
			null,
			{
				root: true,
			},
		);
		stop();
	});

	it('SUBSCRIBE_TO_CONNECTION_STATE resubscribes chats after reconnect', async () => {
		const connectionState = ref(WebSocketConnectionState.Idle);
		const watchContext = {
			rootState: {
				client: {
					state: connectionState,
					getClientSync: () => ({}),
				},
			},
			dispatch: vi.fn(),
		};

		const stop =
			globalsModule.actions.SUBSCRIBE_TO_CONNECTION_STATE(watchContext);
		connectionState.value = WebSocketConnectionState.Connecting;
		await nextTick();
		connectionState.value = WebSocketConnectionState.Connected;
		await nextTick();

		watchContext.dispatch.mockClear();

		connectionState.value = WebSocketConnectionState.Reconnecting;
		await nextTick();
		connectionState.value = WebSocketConnectionState.Connecting;
		await nextTick();
		connectionState.value = WebSocketConnectionState.Connected;
		await nextTick();

		expect(watchContext.dispatch).toHaveBeenCalledWith(
			'features/chat/SUBSCRIBE_CHATS',
			null,
			{
				root: true,
			},
		);
		stop();
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
