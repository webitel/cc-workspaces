import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import globals from '../../../../../features/global-handlers/store/global-handlers';
import DisconnectPopup from '../components/disconnect-popup.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('disconnect popup', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: { globals },
    });
  });

  it('renders a component', () => {
    const wrapper = shallowMount(DisconnectPopup, {
      store,
      localVue,
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders a component when v-if is truthy', () => {
    const wrapper = shallowMount(DisconnectPopup, {
      store,
      localVue,
      computed: {
        isDisconnectPopup() { return true; },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('calls router go() method at "reload" btn', () => {
    const goMock = jest.fn();
    const wrapper = shallowMount(DisconnectPopup, {
      store,
      localVue,
      mocks: { $router: { go: goMock } },
      computed: {
        isDisconnectPopup() { return true; },
      },
    });
    // first btn is "reload"
    wrapper.findComponent({ name: 'wt-button' }).vm.$emit('click');
    expect(goMock).toHaveBeenCalledWith(0);
  });
});
