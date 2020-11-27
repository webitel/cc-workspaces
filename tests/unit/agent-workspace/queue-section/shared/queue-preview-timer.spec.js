import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import now from '@/store/modules/reactive-now/reactive-now';
import QueuePreviewTimer from '../../../../../src/components/agent-workspace/queue-section/shared/queue-preview-timer.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({ modules: { now } });
const task = { createdAt: Date.now() };

describe('QueuePreviewTimer', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(QueuePreviewTimer, { localVue, store, propsData: { task } });
    expect(wrapper.exists()).toBe(true);
  });
});
