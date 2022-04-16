import { shallowMount } from '@vue/test-utils';
import ChatMessageText
  from '../../../../../../../../src/ui/modules/work-section/modules/chat/components/chat-messaging-container/chat-messages/message/chat-message-text.vue';

let message = {};

describe('ChatMessageText component', () => {
  beforeEach(() => {
    message = {};
  });

  it('renders a component', () => {
    const wrapper = shallowMount(ChatMessageText, { propsData: { message } });
    expect(wrapper.exists()).toBe(true);
  });
  it('correctly computes message text', () => {
    const text = 'jest';
    message.text = text;
    const wrapper = shallowMount(ChatMessageText, { propsData: { message } });
    expect(wrapper.vm.text).toBe(text);
  });
});
