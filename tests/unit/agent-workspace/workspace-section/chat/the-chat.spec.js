import { shallowMount } from '@vue/test-utils';
import TheChat
  from '../../../../../src/components/agent-workspace/workspace-section/chat/the-chat.vue';

describe('The Chat', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(TheChat);
    expect(wrapper.exists()).toBe(true);
  });
});
