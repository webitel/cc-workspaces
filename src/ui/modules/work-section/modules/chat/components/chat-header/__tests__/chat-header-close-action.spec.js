import { shallowMount } from '@vue/test-utils';
import ChatHeaderCloseAction from '../chat-header-close-action.vue';

describe('ChatHeaderCloseAction', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(ChatHeaderCloseAction);
    expect(wrapper.isVisible()).toBe(true);
  });
});
