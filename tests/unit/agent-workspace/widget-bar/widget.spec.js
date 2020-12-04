import { shallowMount } from '@vue/test-utils';
import Widget from '../../../../src/components/agent-workspace/widget-bar/widget.vue';

describe('Widget', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(Widget, {
      stubs: { Icon: true },
      propsData: {
        widget: {
          icon: '',
          text: jest.fn(),
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
