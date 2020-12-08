import { shallowMount } from '@vue/test-utils';
import ChatMessage
  from '../../../../../../../src/components/agent-workspace/workspace-section/chat/shared/chat-messages/chat-message.vue';

let message = {};
describe('Chat Message component', () => {
  beforeEach(() => {
    message = {};
  });

  it('renders a component', () => {
    const wrapper = shallowMount(ChatMessage, { propsData: { message } });
    expect(wrapper.exists()).toBe(true);
  });

  it('correctly computes sentAt time', () => {
    message.createdAt = '0';
    const wrapper = shallowMount(ChatMessage, { propsData: { message } });
    expect(wrapper.vm.sentAt).toBeTruthy();
  });

  it('correctly computes message text', () => {
    const text = 'jest';
    message.value = text;
    const wrapper = shallowMount(ChatMessage, { propsData: { message } });
    expect(wrapper.vm.text).toBe(text);
  });
});
