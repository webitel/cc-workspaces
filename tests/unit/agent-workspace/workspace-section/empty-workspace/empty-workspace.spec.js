import { shallowMount } from '@vue/test-utils';
import EmptyWorkspace from '../../../../../src/components/agent-workspace/workspace-section/empty-workspace/empty-workspace.vue';

describe('EmptyWorkspace', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(EmptyWorkspace);
    expect(wrapper.exists()).toBe(true);
  });
});
