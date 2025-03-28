import { shallowMount } from '@vue/test-utils';

import EmptyWorkspaceEmpty from '../empty-workspace-empty.vue';

describe('EmptyWorkspaceEmpty', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(EmptyWorkspaceEmpty);
    expect(wrapper.exists()).toBe(true);
  });
});
