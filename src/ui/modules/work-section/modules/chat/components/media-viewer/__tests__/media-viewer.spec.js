import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import MediaViewer
  from '../media-viewer.vue';
import chat from '../../../../../../../../features/modules/chat/store/chat';

const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({ modules: { chat } });

describe('Media Viewer', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(MediaViewer, { localVue, store });
    expect(wrapper.exists()).toBe(true);
  });
});
