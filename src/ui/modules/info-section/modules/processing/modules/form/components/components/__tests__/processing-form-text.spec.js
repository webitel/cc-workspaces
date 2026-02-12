import { shallowMount } from '@vue/test-utils';

import ProcessingFormText from '../processing-form-text.vue';

describe('ProcessingFormText', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(ProcessingFormText);
		expect(wrapper.isVisible()).toBe(true);
	});
});
