import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import call from '../../../../../../../features/modules/call/call';
import member from '../../../../../../../features/modules/member/member';
import CallQueue from '../the-agent-call-queue.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({ modules: { call, member } });

describe('CallQueue', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(CallQueue, { localVue, store });
    expect(wrapper.exists()).toBe(true);
  });
});
