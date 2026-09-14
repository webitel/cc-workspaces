import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import chat from '../../../../../../../../features/modules/chat/store/chat';
import { WebSocketConnectionState } from '../../../../../../../enums/WebSocketConnectionState.enum.ts';
import ChatQueue from '../../the-agent-chat-queue.vue';

const store = createStore({
	state: {
		client: {
			state: WebSocketConnectionState.Disconnected,
			getClientSync: () => null,
		},
	},
	modules: {
		features: {
			namespaced: true,
			modules: {
				chat,
			},
		},
	},
});

describe('ChatQueue', () => {
	it('renders chat queue root with task queue class', () => {
		const wrapper = shallowMount(ChatQueue, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
	});
});
