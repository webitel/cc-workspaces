import { shallowMount } from '@vue/test-utils';
import CallTransferContainer
  from '../../../../../../src/components/agent-workspace/workspace-section/call/call-transfer/call-transfer-container.vue';

describe('CallTransferContainer', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(CallTransferContainer);
    expect(wrapper.exists()).toBe(true);
  });

  it('at TransferLookupItem "input" event, calls transfer() with passed item and destination', async () => {
    const extension = '123';
    const item = { extension };
    const mock = jest.spyOn(CallTransferContainer.methods, 'blindTransfer')
                     .mockImplementationOnce(() => {});

    const wrapper = shallowMount(CallTransferContainer, {
      data: () => ({
        dataList: [item],
      }),
    });
    wrapper.setData({ isLoading: false }); // cannot normally mock data loading cause isLoading mutations are in mixin
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ name: 'wt-loader' }).exists()).toBe(false);
    expect(wrapper.findComponent({ name: 'empty-search' }).exists()).toBe(false);
    wrapper.findComponent({ name: 'transfer-lookup-item' }).vm.$emit('input', item);
    expect(mock).toHaveBeenCalledWith(extension);
  });

  it('performs transfer to search value at button click', () => {
    const number = '123';
    const mock = jest.spyOn(CallTransferContainer.methods, 'blindTransfer')
                     .mockImplementationOnce(() => {});

    const wrapper = shallowMount(CallTransferContainer, {});
    wrapper.findComponent({ name: 'wt-search-bar' }).vm.$emit('input', number);
    wrapper.findComponent({ name: 'wt-button' }).vm.$emit('click');
    expect(mock).toHaveBeenCalledWith(number);
  });
});
