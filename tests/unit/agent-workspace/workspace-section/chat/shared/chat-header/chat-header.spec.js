import { shallowMount } from '@vue/test-utils';
import ChatHeader
  from '../../../../../../../src/components/agent-workspace/workspace-section/chat/shared/chat-header/chat-header.vue';

describe('Chat Header', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(ChatHeader);
    expect(wrapper.exists()).toBe(true);
  });

  it('calls close() method at close chat button click', () => {
    const closeMock = jest.spyOn(ChatHeader.methods, 'close').mockImplementation(() => {});
    const wrapper = shallowMount(ChatHeader);
    wrapper.findAllComponents({ name: 'wt-rounded-action' }).wrappers
      .find((wrapper) => wrapper.attributes('icon') === 'chat-end')
      .vm.$emit('click');
    expect(closeMock).toHaveBeenCalled();
  });
});
