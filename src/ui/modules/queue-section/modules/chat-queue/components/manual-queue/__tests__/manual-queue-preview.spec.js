import { shallowMount } from '@vue/test-utils';

import ManualQueuePreview from '../manual-queue-preview.vue';

describe('Chats: ManualQueuePreview', () => {
	it('renders preview and computes wait label', () => {
		const wrapper = shallowMount(ManualQueuePreview, {
			props: {
				task: {
					queue: {},
					wait: 65,
					displayName: 'John',
					message: 'hello',
					member: {
						type: 'contact',
					},
					chat: 'telegram',
				},
			},
		});
		expect(wrapper.exists()).toBe(true);
		expect(wrapper.vm.wait).toBe('1:05');
	});
});
