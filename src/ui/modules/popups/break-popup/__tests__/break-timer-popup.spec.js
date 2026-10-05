import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { AgentStatus } from 'webitel-sdk';

import TimerPopup from '../break-timer-popup.vue';

function createTestStore(agent) {
	return createStore({
		modules: {
			ui: {
				namespaced: true,
				modules: {
					now: {
						namespaced: true,
						state: () => ({
							now: Date.now(),
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
							agent,
						}),
					},
				},
			},
		},
	});
}

describe('Break timer popup', () => {
	it('computes and renders break duration', () => {
		const store = createTestStore({
			status: AgentStatus.Pause,
			stateDuration: 12 * 60 * 60,
		});
		const wrapper = shallowMount(TimerPopup, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.vm.duration).toEqual('12:00:00');
		expect(wrapper.vm.duration.split(':')).toHaveLength(3);
	});

	it('hides popup on online status', () => {
		const store = createTestStore({
			status: AgentStatus.Online,
			stateDuration: 0,
		});
		const wrapper = shallowMount(TimerPopup, {
			global: {
				plugins: [
					store,
				],
			},
			attachTo: document.body,
		});
		expect(wrapper.isVisible()).toBeFalsy();
		expect(wrapper.find('.break-timer-popup').exists()).toBe(false);
	});
});
