import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import call from '@/store/modules/call/call';
import userinfo from '@/store/modules/userinfo/userinfo';
import MissedQueueContainer
  from '@/components/agent-workspace/queue-section/call-queue/missed-queue/missed-queue-container.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('MissedQueueContainer', () => {
  const store = new Vuex.Store({
    modules: { call, userinfo },
  });
  it('renders a component', () => {
    const wrapper = shallowMount(MissedQueueContainer, {
      localVue, store,
    });
    expect(wrapper.exists()).toBe(true);
  });
});
