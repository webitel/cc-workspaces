import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import chat from '../../../../../../../features/modules/chat/store/chat.js';
import MediaViewer
  from '../media-viewer.vue';

const store = createStore({ modules: { chat } });

describe('Media Viewer', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(MediaViewer, {
      global: { plugins: [store] },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
