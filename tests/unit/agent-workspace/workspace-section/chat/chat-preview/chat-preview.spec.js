import { shallowMount } from '@vue/test-utils';
import ChatPreview
  from '../../../../../../src/components/agent-workspace/workspace-section/chat/chat-preview/chat-preview.vue';

describe('Chat Preview', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(ChatPreview);
    expect(wrapper.exists()).toBe(true);
  });

  it('calls store sendFile method at handleDrop method', () => {
    const sendFileMock = jest.spyOn(ChatPreview.methods, 'sendFile').mockImplementation(() => {});
    const wrapper = shallowMount(ChatPreview);
    const files = [{ name: 'jest' }];
    const event = { dataTransfer: { files } };
    wrapper.vm.handleDrop(event);
    expect(sendFileMock).toHaveBeenCalledWith(files);
  });
});
