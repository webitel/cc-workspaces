import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import call from '@/features/call/call';
import userinfo from '@/ui/modules/userinfo/userinfo';
import MissedQueueContainer
  from '@/ui/modules/queue-section/modules/call-queue/components/missed-queue/missed-queue-container.vue';

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
