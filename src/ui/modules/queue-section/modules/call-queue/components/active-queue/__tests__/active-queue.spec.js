import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import MockSocket from '../../../../../../../../../tests/unit/mocks/MockSocket';
import { useWebSocketClient } from '../../../../../../../../app/api/agent-workspace/websocket/useWebSocketClient';
import callModule from '../../../../../../../../features/modules/call/call';
import missed from '../../../../../../../../features/modules/call/modules/missed-calls/store/missed-calls';
import workspaceModule from '../../../../../../../store/agent-workspace';
import ActiveQueue from '../active-queue-container.vue';
import ActivePreview from '../active-queue-preview.vue';

const initialCall = {
	isHold: false,
};

const mockSocket = new MockSocket(initialCall);
const webSocketClientController = useWebSocketClient();

vi.spyOn(webSocketClientController, 'getCliInstance').mockImplementation(
	() => mockSocket,
);

describe('Ringing and Hangup events call functionality', () => {
	let state;
	const { actions, mutations } = callModule;
	let store;

	beforeEach(() => {
		state = {
			callList: [
				initialCall,
			],
		};
		store = createStore({
			state: {
				client: webSocketClientController,
			},
			modules: {
				workspace: workspaceModule,
				features: {
					namespaced: true,
					modules: {
						call: {
							namespaced: true,
							state,
							actions,
							mutations,
							modules: {
								missed,
							},
						},
					},
				},
			},
		});
	});

	it('Removes a call when destroy event fires', async () => {
		const wrapper = shallowMount(ActiveQueue, {
			global: {
				plugins: [
					store,
				],
			},
		});
		await wrapper.vm.$store.dispatch('features/call/SUBSCRIBE_CALLS');
		await mockSocket.destroyCall(initialCall);
		await wrapper.vm.$nextTick();
		await wrapper.vm.$nextTick();
		expect(wrapper.findAllComponents(ActivePreview).length).toEqual(0);
	});
});
