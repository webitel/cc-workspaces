import { shallowMount } from '@vue/test-utils';

import TaskQueueContainer from '../task-queue-container.vue';

describe('TaskQueueContainer', () => {
	it('renders queue task container with non-empty modifier off', () => {
		const wrapper = shallowMount(TaskQueueContainer, {
			props: {
				empty: false,
			},
		});
		expect(wrapper.exists()).toBe(true);
		expect(wrapper.find('.queue-task-container').exists()).toBe(true);
		expect(wrapper.classes()).not.toContain('queue-task-container--empty');
	});
});
