import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { CallDirection } from 'webitel-sdk';

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
				name: 'wt-rounded-action',
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
				name: 'wt-rounded-action',
			})
			.vm.$emit('click');
		expect(callAction).toHaveBeenCalledWith(expect.anything(), {
			number: 'true',
		});
	});
});
