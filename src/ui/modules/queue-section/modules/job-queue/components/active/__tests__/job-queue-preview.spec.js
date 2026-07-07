import { shallowMount } from '@vue/test-utils';

import JobQueuePreview from '../job-queue-preview.vue';

const task = {
	distribute: {
		queue_name: 'Support',
		member_name: 'John',
	},
	allowAccept: true,
};

describe('JobQueuePreview', () => {
	it('renders preview with queue name from distribute data', () => {
		const wrapper = shallowMount(JobQueuePreview, {
			props: {
				task,
			},
		});
		expect(wrapper.exists()).toBe(true);
		expect(wrapper.props('task').distribute.queue_name).toBe('Support');
	});
});
