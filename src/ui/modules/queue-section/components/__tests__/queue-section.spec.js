import { shallowMount } from '@vue/test-utils';

import store from '../../../../../app/store';
import QueueSection from '../the-agent-queue-section.vue';

describe('Queue Section', () => {
	it('renders queue section root', () => {
		const wrapper = shallowMount(QueueSection, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.exists()).toBeTruthy();
		expect(wrapper.find('.queue-section').exists()).toBe(true);
		expect(wrapper.classes()).toContain('workspace-section');
	});
});
