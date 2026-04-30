import { mount } from '@vue/test-utils';

import CallTransferContainer from '../_shared/components/call-transfer-container.vue';

describe('CallTransferContainer', () => {
	it('renders a component', () => {
		const wrapper = mount(CallTransferContainer, {
			props: {
				type: 'user',
				getData: vi.fn().mockResolvedValue({
					items: [],
					next: false,
				}),
			},
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('emits transfer event from action button', async () => {
		const wrapper = mount(CallTransferContainer, {
			props: {
				type: 'user',
				getData: vi.fn().mockResolvedValue({
					items: [],
					next: false,
				}),
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
});
