import { shallowMount } from '@vue/test-utils';
import EmptyWorkspace from '../empty-workspace.vue';

describe('EmptyWorkspace', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(EmptyWorkspace);
    expect(wrapper.exists()).toBe(true);
  });
});
