import { shallowMount } from '@vue/test-utils';

import EmptySearch from '../empty-search.vue';

describe('EmptySearch', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(EmptySearch, {
			props: {
				type: 'history',
			},
		});
		expect(wrapper.exists()).toBe(true);
	});
});
