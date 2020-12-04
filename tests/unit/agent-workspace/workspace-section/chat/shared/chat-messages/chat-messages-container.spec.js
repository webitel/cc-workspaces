import { shallowMount } from '@vue/test-utils';
import ChatMessagesContainer
  from '../../../../../../../src/components/agent-workspace/workspace-section/chat/shared/chat-messages/chat-messages-container.vue';

const chat = {
  messages: [],
};
describe('Chat Messages Container', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(ChatMessagesContainer, {
      computed: {
        chat() {
          return chat;
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
