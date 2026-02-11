import { shallowMount } from '@vue/test-utils';

import ProcessingFormSelect from '../processing-form-select.vue';

describe('ProcessingFormSelect', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(ProcessingFormSelect);
		expect(wrapper.isVisible()).toBe(true);
	});
});
