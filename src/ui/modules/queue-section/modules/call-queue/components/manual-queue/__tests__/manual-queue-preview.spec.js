import { shallowMount } from '@vue/test-utils';

import ManualQueuePreview from '../manual-queue-preview.vue';

describe('Calls: ManualQueuePreview', () => {
	it('renders manual preview and computes wait label', () => {
		const wrapper = shallowMount(ManualQueuePreview, {
			props: {
				task: {
					queue: {
						name: 'Support',
					},
					wait: 125,
					displayName: 'John',
					displayNumber: '1001',
				},
			},
		});
		expect(wrapper.exists()).toBe(true);
		expect(wrapper.vm.wait).toBe('2:05');
	});
});
