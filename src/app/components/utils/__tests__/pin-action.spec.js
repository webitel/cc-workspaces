import { shallowMount } from '@vue/test-utils';

import PinAction from '../pin-action.vue';

describe('PinAction', () => {
	it('passes pin icon when item is not pinned', () => {
		const wrapper = shallowMount(PinAction, {
			props: {
				pinned: false,
			},
		});
		expect(wrapper.find('.pin-action').attributes('icon')).toBe('pin');
	});

	it('passes unpin icon when item is pinned', () => {
		const wrapper = shallowMount(PinAction, {
			props: {
				pinned: true,
			},
		});
		expect(wrapper.find('.pin-action').attributes('icon')).toBe('unpin');
	});

	it('emits click event from button', async () => {
		const wrapper = shallowMount(PinAction);
		await wrapper
			.findComponent({
				name: 'wt-icon-btn',
			})
			.vm.$emit('click');
		expect(wrapper.emitted('click')).toHaveLength(1);
	});
});
