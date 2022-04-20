import { shallowMount } from '@vue/test-utils';
import RadialProgress from '../radial-progress.vue';

describe('Radial Progress', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(RadialProgress, {
      propsData: { max: 10, value: 5 },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
