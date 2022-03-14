import { shallowMount } from '@vue/test-utils';
import WtBadge from '../wt-badge.vue';

describe('WtBadge', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(WtBadge);
    expect(wrapper.isVisible()).toBe(true);
  });
});
