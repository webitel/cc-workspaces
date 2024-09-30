import { shallowMount } from '@vue/test-utils';
import ChatMessageMeta
  from '../components/chat-message-time.vue';

let message = {};

describe('ChatMessageMeta component', () => {
  beforeEach(() => {
    message = {};
  });

  it('renders a component', () => {
    const wrapper = shallowMount(ChatMessageMeta, { props: { message } });
    expect(wrapper.exists()).toBe(true);
  });

  it('correctly computes sentAt time', () => {
    message.createdAt = '0';
    const wrapper = shallowMount(ChatMessageMeta, { props: { message } });
    expect(wrapper.vm.sentAt).toBeTruthy();
  });
});
