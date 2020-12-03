import { shallowMount } from '@vue/test-utils';
import ChatPreview
  from '../../../../../../src/components/agent-workspace/workspace-section/chat/chat-preview/chat-preview.vue';

describe('Chat Preview', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(ChatPreview);
    expect(wrapper.exists()).toBe(true);
  });
});
