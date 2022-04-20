import { shallowMount } from '@vue/test-utils';
import VideoContainer from '../video-container.vue';

describe('VideoContainer', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(VideoContainer, {
      computed: {
        call: () => ({}),
      },
      propsData: {
        index: 1,
        call: {},
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
})
;
