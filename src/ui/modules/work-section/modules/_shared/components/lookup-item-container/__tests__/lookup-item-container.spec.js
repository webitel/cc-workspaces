import { shallowMount } from '@vue/test-utils';

import LookupItemContainer from '../lookup-item-container.vue';

describe('LookupItemContainer', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(LookupItemContainer);
		expect(wrapper.exists()).toBeTruthy();
	});
});
