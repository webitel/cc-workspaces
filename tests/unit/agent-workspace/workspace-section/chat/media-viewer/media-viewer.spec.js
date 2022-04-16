import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import MediaViewer
  from '../../../../../../src/ui/modules/work-section/modules/chat/components/media-viewer/media-viewer.vue';
import chat from '../../../../../../src/features/chat/chat';

const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({ modules: { chat } });

describe('Media Viewer', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(MediaViewer, { localVue, store });
    expect(wrapper.exists()).toBe(true);
  });
});
