import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import call from '../../../../../src/store/modules/call/call';
import MissedQueueContainer
  from '../../../../../src/components/agent-workspace/queue-section/call-queue/missed-queue/missed-queue-container.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('MissedQueueContainer', () => {
  const store = new Vuex.Store({
    modules: { call },
  });
  it('renders a component', () => {
    const wrapper = shallowMount(MissedQueueContainer, {
      localVue, store,
    });
    expect(wrapper.exists()).toBe(true);
  });
});
