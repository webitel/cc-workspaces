import { shallowMount } from '@vue/test-utils';

import ProcessingTab from '../processing-tab.vue';

describe('ProcessingTab', () => {
	const task = {
		attempt: {},
	};

	const props = {
		task,
	};

	it('renders reporting view when task form is absent', () => {
		const wrapper = shallowMount(ProcessingTab, {
			props,
		});
		expect(wrapper.isVisible()).toBe(true);
		expect(wrapper.find('.processing').exists()).toBe(true);
		expect(
			wrapper
				.findComponent({
					name: 'the-reporting',
				})
				.exists(),
		).toBe(true);
	});
});
