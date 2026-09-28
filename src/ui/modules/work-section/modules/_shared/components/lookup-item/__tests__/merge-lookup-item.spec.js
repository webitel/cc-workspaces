import { mount, shallowMount } from '@vue/test-utils';

import MergeLookupItem from '../merge-lookup-item.vue';

describe('MergeLookupItem', () => {
	const item = {};
	const computed = {
		...MergeLookupItem.computed,
		now() {
			return 0;
		},
	};

	it('renders a component', () => {
		const wrapper = shallowMount(MergeLookupItem, {
			props: {
				item,
			},
			computed,
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('emits input event at wt-button click', () => {
		const wrapper = mount(MergeLookupItem, {
			props: {
				item,
			},
			computed,
		});
		wrapper
			.findComponent({
				name: 'wt-button',
			})
			.vm.$emit('click');
		expect(wrapper.emitted().input[0]).toEqual([
			item,
		]);
	});
});
