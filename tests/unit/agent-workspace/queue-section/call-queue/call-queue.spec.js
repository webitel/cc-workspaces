import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import call from '@/features/call/call';
import member from '@/features/member/member';
import CallQueue from '../../../../../src/ui/modules/queue-section/modules/call-queue/components/the-agent-call-queue.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({ modules: { call, member } });

describe('CallQueue', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(CallQueue, { localVue, store });
    expect(wrapper.exists()).toBe(true);
  });
});
