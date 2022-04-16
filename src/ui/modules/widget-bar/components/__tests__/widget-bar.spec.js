import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import status from '../../../../../features/agent-status/agent-status';
import WidgetBar from '../widget-bar.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('WidgetBar', () => {
  const store = new Vuex.Store({
    modules: { status },
  });
  it('renders a component', () => {
    const wrapper = shallowMount(WidgetBar, {
      localVue,
      store,
      stubs: { Icon: true },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
