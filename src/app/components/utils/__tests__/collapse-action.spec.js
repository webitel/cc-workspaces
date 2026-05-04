import { shallowMount } from '@vue/test-utils';

import CollapseAction from '../collapse-action.vue';

describe('CollapseAction', () => {
	it('passes expand icon when collapsed', () => {
		const wrapper = shallowMount(CollapseAction, {
			props: {
				collapsed: true,
			},
		});
		expect(wrapper.find('.collapse-action').attributes('icon')).toBe('expand');
	});

	it('passes collapse icon when expanded', () => {
		const wrapper = shallowMount(CollapseAction, {
			props: {
				collapsed: false,
			},
		});
		expect(wrapper.find('.collapse-action').attributes('icon')).toBe(
			'collapse',
		);
	});

	it('emits click event from button', async () => {
		const wrapper = shallowMount(CollapseAction);
		await wrapper
			.findComponent({
				name: 'wt-icon-btn',
			})
			.vm.$emit('click');
		expect(wrapper.emitted('click')).toHaveLength(1);
	});
});
