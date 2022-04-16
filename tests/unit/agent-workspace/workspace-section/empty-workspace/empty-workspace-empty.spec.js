import { shallowMount } from '@vue/test-utils';
import EmptyWorkspaceEmpty from '../../../../../src/ui/modules/work-section/modules/empty-workspace/components/empty-workspace-empty.vue';

describe('EmptyWorkspaceEmpty', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(EmptyWorkspaceEmpty);
    expect(wrapper.exists()).toBe(true);
  });
});
