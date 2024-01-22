import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import WidgetBar from '../widget-bar.vue';
import widget from '../../store/widget';

const store = createStore({
  modules: {
    ui: {
      modules: {
        widget,
      },
    },
  },
});

describe('WidgetBar', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(WidgetBar, {
      global: {
        plugins: [store],
      },
      computed: {
        agent: () => ({}),
        data: () => ({}),
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
