import { shallowMount } from '@vue/test-utils';
import ChatMessagingContainer
  from '../chat-messaging.vue';

describe('ChatMessagingContainer', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(ChatMessagingContainer);
    expect(wrapper.exists()).toBe(true);
  });

  it('calls store sendFile method at handleDrop method', () => {
    const sendFileMock = vi.spyOn(ChatMessagingContainer.methods, 'sendFile').mockImplementation(() => {});
    const wrapper = shallowMount(ChatMessagingContainer);
    const files = [{ name: 'jest' }];
    const event = { dataTransfer: { files } };
    wrapper.vm.handleDrop(event);
    expect(sendFileMock).toHaveBeenCalledWith(files);
  });
});
