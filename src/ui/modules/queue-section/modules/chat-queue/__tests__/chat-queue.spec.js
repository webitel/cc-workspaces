import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import chat from '../../../../../../features/modules/chat/store/chat.js';
import ChatQueue from '../the-agent-chat-queue.vue';

describe('ChatQueue', () => {
  let store;

  beforeEach(() => {
    store = createStore({
      modules: {
        features: {
          namespaced: true,
          modules: { chat },
        },
      },
    });
  });

  it('renders a component', () => {
    const wrapper = shallowMount(ChatQueue, {
      global: { plugins: [store] },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('show counter badges on md size', async () => {
    const wrapper = mount(ChatQueue, {
      shallow: true,
      global: {
        plugins: [store],
        stubs: {
          WtExpansionPanel: false,
          WtExpandTransition: true,
        },
      },
    });
    store.state.features.chat.chatList = [{}, {}];
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ name: 'WtChip' })).toBeTruthy();
  });

  it('hides counter badges on sm size', async () => {
    const wrapper = mount(ChatQueue, {
      shallow: true,
      global: {
        plugins: [store],
        stubs: {
          WtExpansionPanel: false,
          WtExpandTransition: true,
        },
      },
    });
    store.state.features.chat.chatList = [{}, {}];
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ name: 'WtChip' })).toBeTruthy();
  });
});
