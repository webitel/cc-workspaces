import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { CallDirection } from 'webitel-sdk';

import APIRepository from '../../../../../../../../app/api/APIRepository';
import HistoryLookupItem from '../history-lookup-item.vue';

describe('HistoryLookupItem', () => {
	let item;
	let callAction;
	let store;

	beforeEach(() => {
		callAction = vi.fn();
		store = createStore({
			modules: {
				features: {
					namespaced: true,
					modules: {
						call: {
							namespaced: true,
							actions: {
								CALL: callAction,
							},
						},
					},
				},
			},
		});
		item = {
			id: '1',
			direction: CallDirection.Outbound,
			to: {},
			from: {},
			duration: 60,
			createdAt: Date.now(),
		};
	});

	it('renders a component', () => {
		const wrapper = shallowMount(HistoryLookupItem, {
			props: {
				item,
			},
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('emits input event at component click', () => {
		const wrapper = shallowMount(HistoryLookupItem, {
			props: {
				item,
			},
			global: {
				plugins: [
					store,
				],
			},
		});
		wrapper.trigger('click');
		expect(wrapper.emitted().input[0]).toEqual([
			item,
		]);
	});

	it('calls to inbound call number', () => {
		item.direction = CallDirection.Inbound;
		item.from.number = 'true';
		item.to.number = 'false';
		const wrapper = mount(HistoryLookupItem, {
			props: {
				item,
			},
			global: {
				plugins: [
					store,
				],
			},
		});
		wrapper
			.findComponent({
				name: 'wt-button',
			})
			.vm.$emit('click');
		expect(callAction).toHaveBeenCalledWith(expect.anything(), {
			number: 'true',
		});
	});

	it('calls to outbound call number', () => {
		item.direction = CallDirection.Outbound;
		item.from.number = 'false';
		item.to.number = 'true';
		const wrapper = mount(HistoryLookupItem, {
			props: {
				item,
			},
			global: {
				plugins: [
					store,
				],
			},
		});
		wrapper
			.findComponent({
				name: 'wt-button',
			})
			.vm.$emit('click');
		expect(callAction).toHaveBeenCalledWith(expect.anything(), {
			number: 'true',
		});
	});

	describe('masked number', () => {
		const clickCall = (wrapper) =>
			wrapper
				.findComponent({
					name: 'wt-button',
				})
				.vm.$emit('click');

		beforeEach(() => {
			vi.spyOn(APIRepository.history, 'redial').mockResolvedValue({});
		});

		afterEach(() => {
			vi.restoreAllMocks();
		});

		it('redials inbound call by id instead of dialing the masked number', () => {
			item.direction = CallDirection.Inbound;
			item.from.number = '*****888';
			const wrapper = mount(HistoryLookupItem, {
				props: {
					item,
				},
				global: {
					plugins: [
						store,
					],
				},
			});
			clickCall(wrapper);
			expect(APIRepository.history.redial).toHaveBeenCalledWith({
				callId: item.id,
			});
			expect(callAction).not.toHaveBeenCalled();
		});

		it('redials outbound call by id instead of dialing the masked number', () => {
			item.direction = CallDirection.Outbound;
			item.to.number = '*****888';
			const wrapper = mount(HistoryLookupItem, {
				props: {
					item,
				},
				global: {
					plugins: [
						store,
					],
				},
			});
			clickCall(wrapper);
			expect(APIRepository.history.redial).toHaveBeenCalledWith({
				callId: item.id,
			});
			expect(callAction).not.toHaveBeenCalled();
		});

		it('does not redial when the number is not masked', () => {
			item.direction = CallDirection.Outbound;
			item.to.number = '380988888888';
			const wrapper = mount(HistoryLookupItem, {
				props: {
					item,
				},
				global: {
					plugins: [
						store,
					],
				},
			});
			clickCall(wrapper);
			expect(APIRepository.history.redial).not.toHaveBeenCalled();
			expect(callAction).toHaveBeenCalledWith(expect.anything(), {
				number: '380988888888',
			});
		});
	});
});
