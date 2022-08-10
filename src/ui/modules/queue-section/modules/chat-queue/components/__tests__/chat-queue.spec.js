import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import chat from '../../../../../../../features/modules/chat/store/chat';
import ChatQueue from '../the-agent-chat-queue.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({
                               modules: {
                                 features: {
                                   namespaced: true,
                                   modules: { chat },
                                 },
                               },
                             });

describe('ChatQueue', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(ChatQueue, { localVue, store });
    expect(wrapper.exists()).toBe(true);
  });
});
