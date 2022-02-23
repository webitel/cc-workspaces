import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import ChatHeader
  from '../../../../../../../src/components/agent-workspace/workspace-section/chat/chat-header/chat-header.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    chat: {
      namespaced: true,
      getters: {
        ALLOW_CHAT_CLOSE: () => true,
      },
    },
  },
});

describe('Chat Header', () => {
  const mountOptions = {
    localVue,
    store,
  };
  it('renders a component', () => {
    const wrapper = shallowMount(ChatHeader, mountOptions);
    expect(wrapper.exists()).toBe(true);
  });

  it('calls close() method at close chat button click', () => {
    const closeMock = jest.spyOn(ChatHeader.methods, 'close').mockImplementation(() => {
    });
    const wrapper = shallowMount(ChatHeader, mountOptions);
    wrapper.findAllComponents({ name: 'wt-rounded-action' }).wrappers
      .find((wrapper) => wrapper.attributes('icon') === 'chat-end')
      .vm.$emit('click');
    expect(closeMock).toHaveBeenCalled();
  });
});
