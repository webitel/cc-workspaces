import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import call from '../../../../src/features/call/call';
import VideoContainer from '../../../../src/ui/modules/video-container/components/video-container.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('VideoContainer', () => {
  const store = new Vuex.Store({
    modules: { call },
  });
  it('renders a component', () => {
    const wrapper = shallowMount(VideoContainer, {
      localVue,
      store,
      propsData: {
        index: 1,
        call: {},
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
