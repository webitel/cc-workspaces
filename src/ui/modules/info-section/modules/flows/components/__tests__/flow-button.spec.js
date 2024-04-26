import { shallowMount } from '@vue/test-utils';
import FlowButton
  from '../flow-button.vue';

describe('FlowButton', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(FlowButton);
    expect(wrapper.exists()).toBe(true);
  });
});
