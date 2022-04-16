import { shallowMount } from '@vue/test-utils';
import LookupItemWrapper from '../../../../../../src/ui/modules/work-section/modules/shared/components/lookup-item/lookup-item-wrapper.vue';

describe('LookupItemWrapper', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(LookupItemWrapper, {
    });
    expect(wrapper.exists()).toBe(true);
  });
});
