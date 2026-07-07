import { shallowMount } from '@vue/test-utils';

import store from '../../../../../../../app/store';
import CallQueue from '../the-agent-call-queue.vue';

describe('CallQueue', () => {
	it('renders call queue root with task queue class', () => {
		const wrapper = shallowMount(CallQueue, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
		expect(wrapper.find('.call-queue').exists()).toBe(true);
		expect(wrapper.classes()).toContain('task-queue');
	});
});
