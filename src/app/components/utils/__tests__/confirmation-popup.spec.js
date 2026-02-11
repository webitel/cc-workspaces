import { shallowMount } from '@vue/test-utils';

import ConfirmationPopup from '../confirmation-popup.vue';

describe('ConfirmationPopup', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(ConfirmationPopup);
		expect(wrapper.isVisible()).toBe(true);
	});
});
