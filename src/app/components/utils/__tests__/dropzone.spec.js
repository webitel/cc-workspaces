import { shallowMount } from '@vue/test-utils';

import Dropzone
  from '../dropzone.vue';

describe('Dropzone', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(Dropzone);
    expect(wrapper.exists()).toBe(true);
  });
});
