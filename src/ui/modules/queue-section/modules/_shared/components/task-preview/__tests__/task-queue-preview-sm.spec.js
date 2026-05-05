import { shallowMount } from '@vue/test-utils';

import TaskQueuePreviewSm from '../task-queue-preview-sm.vue';

const task = {
	id: '1',
	members: [
		{
			name: 'jest',
		},
	],
	messages: [
		{
			text: 'jest1',
		},
		{
			text: 'jest2',
		},
	],
};

describe('TaskQueuePreviewSm', () => {
	it('renders compact preview root in opened mode', () => {
		const wrapper = shallowMount(TaskQueuePreviewSm, {
			props: {
				opened: true,
				memberName: task.members[0].name,
			},
		});
		expect(wrapper.exists()).toBe(true);
		expect(wrapper.find('.queue-preview-sm').exists()).toBe(true);
		expect(wrapper.classes()).toContain('queue-preview--opened');
	});
});
