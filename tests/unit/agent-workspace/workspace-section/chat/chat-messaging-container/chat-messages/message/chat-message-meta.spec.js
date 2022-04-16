import { shallowMount } from '@vue/test-utils';
import ChatMessageMeta
  from '../../../../../../../../src/ui/modules/work-section/modules/chat/components/chat-messaging-container/chat-messages/message/chat-message-meta.vue';

let message = {};

describe('ChatMessageMeta component', () => {
  beforeEach(() => {
    message = {};
  });

  it('renders a component', () => {
    const wrapper = shallowMount(ChatMessageMeta, { propsData: { message } });
    expect(wrapper.exists()).toBe(true);
  });

  it('correctly computes sentAt time', () => {
    message.createdAt = '0';
    const wrapper = shallowMount(ChatMessageMeta, { propsData: { message } });
    expect(wrapper.vm.sentAt).toBeTruthy();
  });
});
