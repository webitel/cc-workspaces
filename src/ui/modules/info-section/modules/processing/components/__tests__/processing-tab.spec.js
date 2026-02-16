import { shallowMount } from '@vue/test-utils';

import ProcessingTab from '../processing-tab.vue';

describe('ProcessingTab', () => {
	const task = {
		attempt: {},
	};

	const props = {
		task,
	};

	it('renders a component', () => {
		const wrapper = shallowMount(ProcessingTab, {
			props,
		});
		expect(wrapper.isVisible()).toBe(true);
	});
});
