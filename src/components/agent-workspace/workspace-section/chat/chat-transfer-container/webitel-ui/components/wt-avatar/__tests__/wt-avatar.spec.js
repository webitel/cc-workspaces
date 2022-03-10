import { shallowMount } from '@vue/test-utils';
import WtAvatar from '../wt-avatar.vue';

describe('WtAvatar', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(WtAvatar);
    expect(wrapper.isVisible()).toBe(true);
  });
});
