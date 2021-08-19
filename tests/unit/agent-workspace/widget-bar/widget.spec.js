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
  it('widget emits "select" event at click, if selectionMode is true', () => {
    const wrapper = shallowMount(Widget, {
      stubs: { Icon: true },
      propsData: {
        widget: {
          icon: '',
          text: jest.fn(),
        },
        selectionMode: true,
      },
    });
    wrapper.find('.widget').trigger('click');
    expect(wrapper.emitted().select).toBeTruthy();
  });
  it('widget does not emit "select" event at click, if selectionMode is true', () => {
    const wrapper = shallowMount(Widget, {
      stubs: { Icon: true },
      propsData: {
        widget: {
          icon: '',
          text: jest.fn(),
        },
        selectionMode: false,
      },
    });
    wrapper.find('.widget').trigger('click');
    expect(wrapper.emitted().select).toBeFalsy();
  });
});
