import { shallowMount } from '@vue/test-utils';
import ChatMessage
  from '../chat-message.vue';

let message = {};
describe('Chat Message component', () => {
  beforeEach(() => {
    message = {};
  });

  it('renders a component', () => {
    const wrapper = shallowMount(ChatMessage, { props: { message } });
    expect(wrapper.exists()).toBe(true);
  });
});
