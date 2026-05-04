import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import AgentScore from '../agent-score.vue';

describe('General Info: Agent Score', () => {
	it('renders score count and formatted average from store getters', () => {
		const store = createStore({
			modules: {
				ui: {
					namespaced: true,
					modules: {
						widget: {
							namespaced: true,
							getters: {
								SCORE_COUNT: () => 7,
								SCORE_REQUIRED_AVG: () => 3.456,
							},
						},
					},
				},
			},
		});
		const wrapper = shallowMount(AgentScore, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
		expect(wrapper.vm.scoreCount).toBe(7);
		expect(wrapper.vm.scoreAvg).toBe(3.456);
		expect((+wrapper.vm.scoreAvg || 0).toFixed(2)).toBe('3.46');
	});
});
