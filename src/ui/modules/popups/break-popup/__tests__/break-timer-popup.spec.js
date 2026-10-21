import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { AgentStatus } from 'webitel-sdk';

import TimerPopup from '../break-timer-popup.vue';

const NOW = Date.now();

function createTestStore(agent) {
	return createStore({
		modules: {
			ui: {
				namespaced: true,
				modules: {
					now: {
						namespaced: true,
						state: () => ({
							now: NOW,
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
	it('resets duration on status change before the next now tick', async () => {
		const store = createTestStore({
			status: AgentStatus.Online,
			lastStatusChange: NOW - 69_600,
		});
		const wrapper = shallowMount(TimerPopup, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.vm.duration).toEqual('00:01:10');

		const { agent } = store.state.features.status;
		agent.status = AgentStatus.Pause;
		agent.lastStatusChange = NOW + 900;
		await wrapper.vm.$nextTick();

		expect(wrapper.vm.duration).toEqual('00:00:00');
	});

	it('hides popup on online status', () => {
		const store = createTestStore({
			status: AgentStatus.Online,
			lastStatusChange: NOW,
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
