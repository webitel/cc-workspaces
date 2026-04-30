import { shallowMount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { createStore } from 'vuex';

import ChatTransferDestination from '../../enums/ChatTransferDestination.enum.js';
import ChatTransferContainer from '../chat-transfer-container.vue';

describe('ChatTransferContainer', () => {
	const store = createStore({
		modules: {
			features: {
				namespaced: true,
				modules: {
					chat: {
						namespaced: true,
						actions: {
							TRANSFER: vi.fn().mockResolvedValue(undefined),
						},
					},
				},
			},
		},
	});

	it('renders a component', () => {
		const wrapper = shallowMount(ChatTransferContainer, {
			global: {
				plugins: [
					store,
					createPinia(),
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('emits closeTab on close action click', async () => {
		const wrapper = shallowMount(ChatTransferContainer, {
			global: {
				plugins: [
					store,
					createPinia(),
				],
				stubs: {
					LookupItemContainer: false,
					TransferLookupItem: false,
				},
			},
		});
		await wrapper
			.findComponent({
				name: 'wt-icon-btn',
			})
			.trigger('click');
		expect(wrapper.emitted().closeTab?.length).toBe(1);
	});
});
