import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import call from '../../../../../../../../features/modules/call/call';
import MissedQueueContainer
  from '../missed-queue-container.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('MissedQueueContainer', () => {
  const store = new Vuex.Store({
    modules: { features: { namespaced: true, modules: { call } } },
  });
  it('renders a component', () => {
    const wrapper = shallowMount(MissedQueueContainer, {
      localVue, store,
    });
    expect(wrapper.exists()).toBe(true);
  });
});
