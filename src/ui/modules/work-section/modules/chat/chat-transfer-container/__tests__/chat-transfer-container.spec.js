import { shallowMount } from '@vue/test-utils';

import ChatTransferDestination from '../../enums/ChatTransferDestination.enum.js';
import ChatTransferContainer from '../chat-transfer-container.vue';

describe('ChatTransferContainer', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(ChatTransferContainer);
		expect(wrapper.exists()).toBe(true);
	});

	it('at TransferLookupItem "input" event, calls transfer() with passed item and destination', async () => {
		const transferDestination = ChatTransferDestination.CHATPLAN;
		const item = {
			id: 'jest',
		};
		const mock = vi
			.spyOn(ChatTransferContainer.methods, 'transfer')
			.mockImplementationOnce(() => {});

		const wrapper = shallowMount(ChatTransferContainer, {
			attachTo: document.body, // for isVisible to work https://github.com/vuejs/vue-test-utils/issues/2073#issuecomment-1732696542
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
				transferDestination,
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
		expect(mock).toHaveBeenCalledWith({
			destination: transferDestination,
			item,
		});
	});
});
