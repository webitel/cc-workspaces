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

const store = createStore({
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
								flows: flowsData,
							},
						},
					},
				},
			},
		},
	},
});

describe('FlowsTab', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(FlowsTab, {
			global: {
				plugins: [
					store,
				],
			},
			computed: {
				flowsList: () => [],
			},
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('renders flows list', async () => {
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

	it('hide dummy', async () => {
		const wrapper = shallowMount(FlowsTab, {
			global: {
				plugins: [
					store,
				],
			},
		});

		const dummy = wrapper.find('.flows-tab__dummy');
		expect(dummy.exists()).toBe(false);
	});
});
