import { shallowMount } from '@vue/test-utils';
import ChatMessage
  from '../../../../../../../../src/components/agent-workspace/workspace-section/chat/chat-messaging-container/chat-messages/message/chat-message.vue';

let message = {};
describe('Chat Message component', () => {
  beforeEach(() => {
    message = {};
  });

  it('renders a component', () => {
    const wrapper = shallowMount(ChatMessage, { propsData: { message } });
    expect(wrapper.exists()).toBe(true);
  });
});
