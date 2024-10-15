import { shallowMount } from '@vue/test-utils';
import ChatMessageText
  from '../chat-message-text.vue';

let text = {};

describe('ChatMessageText component', () => {
  beforeEach(() => {
    text = '';
  });

  it('renders a component', () => {
    const wrapper = shallowMount(ChatMessageText, { props: { text } });
    expect(wrapper.exists()).toBe(true);
  });
  it('correctly computes message text', () => {
    const text = 'jest';

    const wrapper = shallowMount(ChatMessageText, { props: { text } });
    expect(wrapper.vm.text).toBe(text);
  });
});
