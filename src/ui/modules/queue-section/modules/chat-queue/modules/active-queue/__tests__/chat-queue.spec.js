import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import chat from '../../../../../../../../features/modules/chat/store/chat.js';
import ChatQueue from '../../../the-agent-chat-queue.vue';

const store = createStore({
                               modules: {
                                 features: {
                                   namespaced: true,
                                   modules: { chat },
                                 },
                               },
                             });

describe('ChatQueue', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(ChatQueue, {
      global: { plugins: [store] },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
