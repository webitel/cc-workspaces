import { shallowMount } from '@vue/test-utils';

import PinAction from '../pin-action.vue';

describe('PinAction', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(PinAction);
    expect(wrapper.isVisible()).toBe(true);
  });
});
