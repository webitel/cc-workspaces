import { shallowMount } from '@vue/test-utils';
import FlowButton
  from '../flow-button.vue';

describe('FlowButton', () => {
  it('renders a component', () => {
    const id = 12;
    const wrapper = shallowMount(FlowButton, {
      props: { id },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
