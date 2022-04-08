import { shallowMount } from '@vue/test-utils';
import LookupItemWrapper from '../../../../../../src/components/agent-workspace/workspace-section/shared/lookup-item/lookup-item-wrapper.vue';

describe('LookupItemWrapper', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(LookupItemWrapper, {
    });
    expect(wrapper.exists()).toBe(true);
  });
});
