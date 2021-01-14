import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import call from '@/store/modules/call/call';
import member from '@/store/modules/member/member';
import CallQueue from '../../../../../src/components/agent-workspace/queue-section/call-queue/the-agent-call-queue.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({ modules: { call, member } });

describe('CallQueue', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(CallQueue, { localVue, store });
    expect(wrapper.exists()).toBe(true);
  });
});
