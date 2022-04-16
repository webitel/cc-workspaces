import { shallowMount } from '@vue/test-utils';
import Dropzone
  from '../../../src/app/components/utils/dropzone.vue';

describe('Dropzone', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(Dropzone);
    expect(wrapper.exists()).toBe(true);
  });
});
