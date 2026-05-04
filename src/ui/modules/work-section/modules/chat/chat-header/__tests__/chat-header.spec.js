import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import ChatHeader from '../chat-header.vue';

describe('Chat Header', () => {
	const buildStore = ({ allowTransfer = true, allowClose = true } = {}) =>
		createStore({
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
								ALLOW_CHAT_CLOSE: () => allowClose,
								ALLOW_CHAT_TRANSFER: () => allowTransfer,
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

	let store;

	beforeEach(() => {
		store = buildStore();
		vi.spyOn(store, 'dispatch');
	});

	const getMountOptions = (customStore = store) => ({
		global: {
			plugins: [
				customStore,
			],
		},
		props: {
			currentTab: 'chat-messaging',
		},
	});
	it('renders a component', () => {
		const wrapper = shallowMount(ChatHeader, getMountOptions());
		expect(wrapper.exists()).toBe(true);
	});

	it('$emits openTab event at transfer button click', () => {
		const wrapper = mount(ChatHeader, getMountOptions());
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
		const wrapper = mount(ChatHeader, getMountOptions());
		wrapper
			.findComponent({
				name: 'chat-header-close-action',
			})
			.vm.$emit('click');
		expect(store.dispatch).toHaveBeenCalledWith('features/chat/CLOSE');
	});

	it('marks transfer action as active on transfer tab', () => {
		const wrapper = mount(ChatHeader, {
			...getMountOptions(),
			props: {
				currentTab: 'chat-transfer-container',
			},
		});
		const transferBtn = wrapper
			.findAllComponents({
				name: 'wt-button',
			})
			.find((w) => w.props('icon') === 'chat-transfer--filled');
		expect(transferBtn.props('variant')).toBe('active');
	});

	it('hides transfer button when ALLOW_CHAT_TRANSFER is false', () => {
		const disabledTransferStore = buildStore({
			allowTransfer: false,
		});
		const wrapper = mount(ChatHeader, {
			...getMountOptions(disabledTransferStore),
		});
		expect(wrapper.vm.isTransferAction).toBe(false);
	});
});
