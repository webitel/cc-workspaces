import { shallowMount } from '@vue/test-utils';
import WidgetBar from '../widget-bar.vue';

describe('WidgetBar', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(WidgetBar, {
      computed: {
        agent: () => ({}),
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
