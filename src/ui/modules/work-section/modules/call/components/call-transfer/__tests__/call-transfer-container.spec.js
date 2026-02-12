import { mount, shallowMount } from '@vue/test-utils';

import CallTransferContainer from '../_shared/components/call-transfer-container.vue';

describe('CallTransferContainer', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(CallTransferContainer);
		expect(wrapper.exists()).toBe(true);
	});

	it('at TransferLookupItem "input" event, calls transfer() with passed item and destination', async () => {
		const extension = '123';
		const item = {
			extension,
		};
		const mock = vi
			.spyOn(CallTransferContainer.methods, 'blindTransfer')
			.mockImplementationOnce(() => {});

		const wrapper = mount(CallTransferContainer, {
			attachTo: document.body,
			shallow: true,
			global: {
				stubs: {
					LookupItemContainer: false,
					TransferLookupItem: false,
				},
			},
			data: () => ({
				dataList: [
					item,
				],
				isLoading: false,
			}),
		});
		await wrapper.vm.$nextTick();
		expect(
			wrapper
				.findComponent({
					name: 'wt-loader',
				})
				.exists(),
		).toBe(false);
		expect(
			wrapper
				.findComponent({
					name: 'empty-search',
				})
				.isVisible(),
		).toBe(false);
		wrapper
			.findComponent({
				name: 'transfer-lookup-item',
			})
			.vm.$emit('input', item);
		expect(mock).toHaveBeenCalledWith(extension);
	});

	it('performs transfer to search value at button click', async () => {
		const number = '123';
		const mock = vi
			.spyOn(CallTransferContainer.methods, 'blindTransfer')
			.mockImplementationOnce(() => {});

		const wrapper = shallowMount(CallTransferContainer, {
			shallow: true,
			global: {
				stubs: {
					LookupItemContainer: false,
					TransferLookupItem: false,
				},
			},
		});
		wrapper
			.findComponent({
				name: 'wt-search-bar',
			})
			.vm.$emit('input', number);
		wrapper
			.findComponent({
				name: 'wt-button',
			})
			.vm.$emit('click');
		expect(mock).toHaveBeenCalledWith(number);
	});
});
