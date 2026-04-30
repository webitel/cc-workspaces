import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import FlowsTab from '../flows-tab.vue';

const flowsData = [
	{
		id: 1,
		name: 'flow1',
	},
	{
		id: 2,
		name: 'flow2',
	},
];

const buildStore = (flows = flowsData) =>
	createStore({
		modules: {
			ui: {
				namespaced: true,
				modules: {
					infoSec: {
						namespaced: true,
						modules: {
							flows: {
								namespaced: true,
								state: {
									flows,
								},
							},
						},
					},
				},
			},
		},
	});

describe('FlowsTab', () => {
	it('renders component root', () => {
		const store = buildStore([]);
		const wrapper = shallowMount(FlowsTab, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('renders flows list from store state', async () => {
		const store = buildStore(flowsData);
		const wrapper = shallowMount(FlowsTab, {
			global: {
				plugins: [
					store,
				],
			},
		});

		const list = wrapper.findAll('.flows-tab-item-wrapper');
		expect(list.length).toBe(flowsData.length);
	});

	it('does not render list when there are no flows', async () => {
		const store = buildStore([]);
		const wrapper = shallowMount(FlowsTab, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.find('.flows-tab-item-wrapper').exists()).toBe(false);
	});
});
