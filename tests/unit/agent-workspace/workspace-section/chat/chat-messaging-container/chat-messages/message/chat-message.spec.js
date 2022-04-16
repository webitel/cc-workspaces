import { shallowMount } from '@vue/test-utils';
import ChatMessage
  from '../../../../../../../../src/ui/modules/work-section/modules/chat/components/chat-messaging-container/chat-messages/message/chat-message.vue';

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
