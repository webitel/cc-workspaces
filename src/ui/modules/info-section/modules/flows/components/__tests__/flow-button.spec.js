import { shallowMount } from '@vue/test-utils';
import FlowButton
  from '../flow-button.vue';
import FlowsAPI from '../../api/flows';

const id = 12;

describe('FlowButton', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(FlowButton, {
      props: { id },
    });
    expect(wrapper.exists()).toBe(true);
  });
  // it('click button', () => {
  //   const wrapper = shallowMount(FlowButton, {
  //     props: { id },
  //   });
  // });
});
