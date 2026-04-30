import { mount, shallowMount } from '@vue/test-utils';
import { AgentStatus } from 'webitel-sdk';

import TimerPopup from '../break-timer-popup.vue';

const agent = {
	status: AgentStatus.Pause,
	stateDuration: 12 * 60 * 60,
};

const computed = {
	agent() {
		return agent;
	},
	now() {
		return Date.now();
	},
};

describe('Break timer popup', () => {
	it('computes and renders break duration', () => {
		agent.status = AgentStatus.Pause;
		const wrapper = shallowMount(TimerPopup, {
			computed,
		});
		expect(wrapper.vm.duration).toEqual('12:00:00');
		expect(wrapper.vm.duration.split(':')).toHaveLength(3);
	});

	it('hides popup on online status', () => {
		agent.status = AgentStatus.Online;
		const wrapper = shallowMount(TimerPopup, {
			computed,
			attachTo: document.body,
		});
		expect(wrapper.isVisible()).toBeFalsy();
		expect(wrapper.find('.break-timer-popup').exists()).toBe(false);
	});
});
