import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import agentInfo from '../../store/agent-info';
import GeneralInfoTab from '../general-info-tab.vue';

const agent = {};

const store = createStore({
	modules: {
		features: {
			namespaced: true,
			modules: {
				status: {
					state: {
						agent,
					},
					namespaced: true,
				},
			},
		},
		ui: {
			namespaced: true,
			modules: {
				infoSec: {
					namespaced: true,
					modules: {
						agentInfo,
					},
				},
			},
		},
	},
});

describe('General Info Tab', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(GeneralInfoTab, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
	});
});
