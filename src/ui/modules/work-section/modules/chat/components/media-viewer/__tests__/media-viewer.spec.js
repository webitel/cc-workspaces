import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import MediaViewer
  from '../media-viewer.vue';
import chat from '../../../../../../../../features/modules/chat/store/chat';

const store = createStore({ modules: { chat } });

describe('Media Viewer', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(MediaViewer, {
      global: { plugins: [store] },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
