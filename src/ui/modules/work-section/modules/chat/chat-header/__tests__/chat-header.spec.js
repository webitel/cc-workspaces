import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import ChatHeader from '../chat-header.vue';

const store = createStore({
	modules: {
		ui: {
			namespaced: true,
			modules: {
				infoSec: {
					namespaced: true,
					modules: {
						client: {
							namespaced: true,
							modules: {
								contact: {
									namespaced: true,
									getters: {
										CONTACT_LINK: () => () => '#',
									},
								},
							},
						},
					},
				},
			},
		},
		features: {
			namespaced: true,
			modules: {
				chat: {
					namespaced: true,
					getters: {
						ALLOW_CHAT_CLOSE: () => true,
						ALLOW_CHAT_TRANSFER: () => true,
						CHAT_ON_WORKSPACE: () => ({
							members: [],
							displayNumber: '123',
						}),
					},
					actions: {
						CLOSE: vi.fn(),
					},
				},
			},
		},
	},
});

describe('Chat Header', () => {
	beforeEach(() => {
		vi.spyOn(store, 'dispatch');
	});
	const mountOptions = {
		global: {
			plugins: [
				store,
			],
		},
		props: {
			currentTab: 'chat-messaging',
		},
	};
	it('renders a component', () => {
		const wrapper = shallowMount(ChatHeader, mountOptions);
		expect(wrapper.exists()).toBe(true);
	});

	it('$emits openTab event at transfer button click', () => {
		const wrapper = mount(ChatHeader, mountOptions);
		wrapper
			.findAllComponents({
				name: 'wt-button',
			})
			.find((w) => w.props('icon') === 'chat-transfer--filled')
			.vm.$emit('click');
		expect(wrapper.emitted().openTab[0]).toEqual([
			'transfer',
		]);
	});

	it('dispatches CLOSE at close action click', () => {
		const wrapper = mount(ChatHeader, mountOptions);
		wrapper
			.findComponent({
				name: 'chat-header-close-action',
			})
			.vm.$emit('click');
		expect(store.dispatch).toHaveBeenCalledWith('features/chat/CLOSE');
	});
});
