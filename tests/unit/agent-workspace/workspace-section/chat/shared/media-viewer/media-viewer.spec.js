import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import MediaViewer
  from '../../../../../../../src/components/agent-workspace/workspace-section/chat/shared/media-viewer/media-viewer.vue';
import chat from '../../../../../../../src/store/modules/chat/chat';

const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({ modules: { chat }});

describe('Media Viewer', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(MediaViewer, { localVue, store });
    expect(wrapper.exists()).toBe(true);
  });
});
