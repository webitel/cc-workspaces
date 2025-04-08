import { shallowMount } from '@vue/test-utils';

import CollapseAction from '../collapse-action.vue';

describe('CollapseAction', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(CollapseAction);
    expect(wrapper.isVisible()).toBe(true);
  });
});
