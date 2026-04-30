import { mount, shallowMount } from '@vue/test-utils';

import store from '../../../../../app/store';
import QueueSection from '../the-agent-queue-section.vue';

describe('Queue Section', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(QueueSection, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.exists()).toBeTruthy();
	});
});
