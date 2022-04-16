import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import ChatQueue from '../the-agent-chat-queue.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({});

describe('ChatQueue', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(ChatQueue, { localVue, store });
    expect(wrapper.exists()).toBe(true);
  });
});
