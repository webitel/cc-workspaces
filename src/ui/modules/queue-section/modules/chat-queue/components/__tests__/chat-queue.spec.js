import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import chat from '../../../../../../../features/modules/chat/store/chat';
import { WebSocketConnectionState } from '../../../../../../enums/WebSocketConnectionState.enum.ts';
import ChatQueue from '../the-agent-chat-queue.vue';

describe('ChatQueue', () => {
	let store;

	beforeEach(() => {
		store = createStore({
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
	});

	it('renders a component', () => {
		const wrapper = shallowMount(ChatQueue, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('applies md size class', async () => {
		const wrapper = mount(ChatQueue, {
			shallow: true,
			global: {
				plugins: [
					store,
				],
				stubs: {
					WtExpansionPanel: {
						template:
							'<div><slot name="title" /><slot name="actions" /><slot /></div>',
					},
					WtExpandTransition: true,
				},
			},
		});
		await wrapper.vm.$nextTick();
		expect(wrapper.classes()).toContain('chat-queue--md');
	});

	it('hides counter badges on sm size', async () => {
		const wrapper = mount(ChatQueue, {
			props: {
				size: 'sm',
			},
			shallow: true,
			global: {
				plugins: [
					store,
				],
				stubs: {
					WtExpansionPanel: {
						template:
							'<div><slot name="title" /><slot name="actions" /><slot /></div>',
					},
					WtExpandTransition: true,
				},
			},
		});
		await wrapper.vm.$nextTick();
		expect(wrapper.find('wt-chip-stub').exists()).toBe(false);
	});
});
