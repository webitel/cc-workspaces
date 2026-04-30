import { shallowMount } from '@vue/test-utils';

import store from '../../../../../../../../app/store';
import ManualQueueContainer from '../manual-queue-container.vue';

describe('Calls: ManualQueueContainer', () => {
	it('renders manual queue container root', () => {
		const wrapper = shallowMount(ManualQueueContainer, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
		expect(
			wrapper
				.findComponent({
					name: 'task-queue-container',
				})
				.exists(),
		).toBe(true);
	});
});
