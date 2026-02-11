import { shallowMount } from '@vue/test-utils';

import ProcessingFormDatetimepicker from '../processing-form-datetimepicker.vue';

describe('ProcessingFormDatetimepicker', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(ProcessingFormDatetimepicker);
		expect(wrapper.isVisible()).toBe(true);
	});
});
