import { shallowMount } from '@vue/test-utils';
import ChatMessageText
  from '../components/chat-message-text.vue';

let message = {};

describe('ChatMessageText component', () => {
  beforeEach(() => {
    message = {};
  });

  it('renders a component', () => {
    const wrapper = shallowMount(ChatMessageText, { props: { message } });
    expect(wrapper.exists()).toBe(true);
  });
  it('correctly computes message text', () => {
    const text = 'jest';
    message.text = text;
    const wrapper = shallowMount(ChatMessageText, { props: { message } });
    expect(wrapper.vm.text).toBe(text);
  });
});
