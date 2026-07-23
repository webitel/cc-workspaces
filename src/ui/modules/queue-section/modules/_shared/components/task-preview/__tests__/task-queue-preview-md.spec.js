import { mount, shallowMount } from '@vue/test-utils';

import TaskQueuePreviewMd from '../task-queue-preview-md.vue';

describe('TaskQueuePreviewMd', () => {
	it('renders preview root container', () => {
		const wrapper = shallowMount(TaskQueuePreviewMd);
		expect(wrapper.exists()).toBe(true);
	});

	it('displays queue name when queueName prop is passed', () => {
		const queueName = 'queue name';
		const wrapper = mount(TaskQueuePreviewMd, {
			props: {
				queueName,
			},
		});
		expect(wrapper.find('.queue-name').text()).toContain(
			queueName,
		);
	});

	it('does not render queue text when queueName is empty', () => {
		const wrapper = shallowMount(TaskQueuePreviewMd);
		expect(
			wrapper
				.findComponent({
					name: 'queue-name-text',
				})
				.exists(),
		).toBe(false);
	});

	it('emits click on enter key press', async () => {
		const wrapper = shallowMount(TaskQueuePreviewMd);
		await wrapper.trigger('keydown.enter');
		expect(wrapper.emitted('click')).toHaveLength(1);
	});
});
