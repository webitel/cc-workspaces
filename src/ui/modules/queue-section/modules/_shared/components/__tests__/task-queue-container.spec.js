import { shallowMount } from '@vue/test-utils';

import TaskQueueContainer from '../task-queue-container.vue';

describe('TaskQueueContainer', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(TaskQueueContainer);
		expect(wrapper.exists()).toBe(true);
	});
});
