import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import ProcessingTimer from '../processing-timer.vue';

describe('Post Processing Timer', () => {
	const now = Date.now();
	const store = createStore({
		state: {
			ui: {
				now: {
					now: now + 20 * 1000,
				},
			},
		},
	});
	const mountOptions = {
		global: {
			plugins: [
				store,
			],
		},
		props: {
			startProcessingAt: now,
			processingTimeoutAt: now + 30 * 1000,
			renewalSec: 15,
			processingSec: 30,
			processing: {
				processingProlongation: {
					remainingProlongations: 1,
					prolongationSec: 30,
				},
			},
		},
	};
	it('renders a component', () => {
		const wrapper = shallowMount(ProcessingTimer, mountOptions);
		expect(wrapper.exists()).toBe(true);
	});
	it('correctly computes processingSecLeft', () => {
		const wrapper = shallowMount(ProcessingTimer, mountOptions);
		expect(wrapper.vm.processingSecLeft).toBe(10);
	});
	it('correctly computes processingEndSec', () => {
		const wrapper = shallowMount(ProcessingTimer, mountOptions);
		expect(wrapper.vm.processingEndSec).toBe(30);
	});
	it('correctly computes processingProgressSec', () => {
		const wrapper = shallowMount(ProcessingTimer, mountOptions);
		expect(wrapper.vm.processingProgressSec).toBe(20);
	});
	it('correctly computes showRenewalButton with truthy value', () => {
		const wrapper = shallowMount(ProcessingTimer, mountOptions);
		expect(wrapper.vm.showRenewalButton).toBeTruthy();
	});
	it('at plus click emits "click" event', () => {
		const wrapper = mount(ProcessingTimer, mountOptions);
		wrapper
			.findComponent({
				name: 'wt-icon-btn',
			})
			.vm.$emit('click');
		expect(wrapper.emitted().click[0]).toEqual([
			30,
		]);
	});
});
