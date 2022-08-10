import { shallowMount } from '@vue/test-utils';
import LookupItemWrapper from '../lookup-item-wrapper.vue';

describe('LookupItemWrapper', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(LookupItemWrapper, {
    });
    expect(wrapper.exists()).toBe(true);
  });
});
