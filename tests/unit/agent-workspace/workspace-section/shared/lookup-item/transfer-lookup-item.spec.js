import { shallowMount } from '@vue/test-utils';
import TransferLookupItem from '../../../../../../src/components/agent-workspace/workspace-section/shared/lookup-item/transfer-lookup-item.vue';
import ChatTransferDestination from '../../../../../../src/enums/ChatTransferDestination.enum';

describe('TransferLookupItem', () => {
  const item = {};
  const type = ChatTransferDestination.USER;

  it('renders a component', () => {
    const wrapper = shallowMount(TransferLookupItem, {
      propsData: { item, type },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('emits input event at wt-icon-btn click', () => {
    const wrapper = shallowMount(TransferLookupItem, {
      propsData: { item, type },
    });
    wrapper.findComponent({ name: 'wt-icon-btn' }).vm.$emit('click');
    expect(wrapper.emitted().input[0]).toEqual([item]);
  });
});
