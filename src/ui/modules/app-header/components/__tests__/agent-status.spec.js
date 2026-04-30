import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import StatusSelect from '../agent-status-select.vue';

const now = 1_700_000_000_000;
const lastStatusChange = now - 12 * 60 * 60 * 10 ** 3; // '12:00:00'

describe('Agent Status Select', () => {
	it('renders status select with computed status duration', () => {
		const store = createStore({
			modules: {
				ui: {
					namespaced: true,
					modules: {
						now: {
							namespaced: true,
							state: () => ({
								now,
							}),
						},
					},
				},
				features: {
					namespaced: true,
					modules: {
						status: {
							namespaced: true,
							state: () => ({
								agent: {
									agentId: 'agent-1',
									status: 'online',
									lastStatusChange,
								},
							}),
						},
					},
				},
			},
		});
		const wrapper = shallowMount(StatusSelect, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
		expect(wrapper.find('.agent-status-select').exists()).toBe(true);
		expect(wrapper.vm.statusDuration).toBe('12:00:00');
	});

	// it('correctly computes statusDuration', () => {
	//   agent.lastStatusChange = Date.now() - 24 * 1000;
	//   const wrapper = shallowMount(StatusSelect, { store, localVue });
	//   expect(wrapper.vm.statusDuration).toBe('00:00:23'); // 24 - 1
	// });
});
