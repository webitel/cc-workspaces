import { shallowMount } from '@vue/test-utils';

import LookupItem from '../lookup-item.vue';

describe('LookupItem', () => {
	const item = {};
	it('renders a component', () => {
		const wrapper = shallowMount(LookupItem, {
			props: {
				item,
			},
		});
		expect(wrapper.exists()).toBe(true);
	});
});
