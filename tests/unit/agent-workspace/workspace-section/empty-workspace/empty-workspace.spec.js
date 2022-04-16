import { shallowMount } from '@vue/test-utils';
import EmptyWorkspace from '../../../../../src/ui/modules/work-section/modules/empty-workspace/components/empty-workspace.vue';

describe('EmptyWorkspace', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(EmptyWorkspace);
    expect(wrapper.exists()).toBe(true);
  });
});
