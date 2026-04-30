import { mount } from '@vue/test-utils';

import CallTransferContainer from '../_shared/components/call-transfer-container.vue';

describe('CallTransferContainer', () => {
	const getData = vi.fn().mockResolvedValue({
		items: [],
		next: false,
	});

	it('renders transfer container root', () => {
		const wrapper = mount(CallTransferContainer, {
			props: {
				type: 'user',
				getData,
			},
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('emits transfer event from action button', async () => {
		const wrapper = mount(CallTransferContainer, {
			props: {
				type: 'user',
				getData,
			},
		});
		wrapper
			.findComponent({
				name: 'lookup-item-container',
			})
			.vm.$emit('search:input', '123');
		await wrapper.vm.$nextTick();
		await wrapper
			.findComponent({
				name: 'wt-button',
			})
			.trigger('click');
		expect(wrapper.emitted().transfer?.[0]).toEqual([
			{
				extension: '123',
			},
		]);
	});

	it('does not emit transfer when search input is empty', async () => {
		const wrapper = mount(CallTransferContainer, {
			props: {
				type: 'user',
				getData,
			},
		});
		await wrapper
			.findComponent({
				name: 'wt-button',
			})
			.trigger('click');
		expect(wrapper.emitted().transfer).toBeFalsy();
	});
});
