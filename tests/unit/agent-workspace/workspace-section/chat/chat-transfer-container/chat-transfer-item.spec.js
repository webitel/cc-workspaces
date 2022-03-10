import { shallowMount } from '@vue/test-utils';
import ChatTransferItem from '../../../../../../src/components/agent-workspace/workspace-section/chat/chat-transfer-container/chat-transfer-item.vue';
import ChatTransferDestination from '../../../../../../src/enums/ChatTransferDestination.enum';

describe('ChatTransferItem', () => {
  const item = {};
  const type = ChatTransferDestination.USER;

  it('renders a component', () => {
    const wrapper = shallowMount(ChatTransferItem, {
      propsData: {
        item,
        type,
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
