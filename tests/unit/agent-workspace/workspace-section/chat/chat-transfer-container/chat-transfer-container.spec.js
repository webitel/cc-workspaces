import { shallowMount } from '@vue/test-utils';
import ChatTransferContainer from '../../../../../../src/components/agent-workspace/workspace-section/chat/chat-transfer-container/chat-transfer-container.vue';
import ChatTransferDestination from '../../../../../../src/enums/ChatTransferDestination.enum';

describe('ChatTransferContainer', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(ChatTransferContainer);
    expect(wrapper.exists()).toBe(true);
  });

  it('at TransferLookupItem "input" event, calls transfer() with passed item and destination', async () => {
    const transferDestination = ChatTransferDestination.CHATPLAN;
    const item = { id: 'jest' };
    const mock = jest.spyOn(ChatTransferContainer.methods, 'transfer')
      .mockImplementationOnce(() => {});

    const wrapper = shallowMount(ChatTransferContainer, {
      data: () => ({
        dataList: [item],
        transferDestination,
      }),
    });
    wrapper.setData({ isLoading: false }); // cannot normally mock data loading cause isLoading mutations are in mixin
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ name: 'wt-loader' }).exists()).toBe(false);
    expect(wrapper.findComponent({ name: 'empty-search' }).exists()).toBe(false);
    wrapper.findComponent({ name: 'transfer-lookup-item' }).vm.$emit('input', item);
    expect(mock).toHaveBeenCalledWith({ destination: transferDestination, item });
  });
});
