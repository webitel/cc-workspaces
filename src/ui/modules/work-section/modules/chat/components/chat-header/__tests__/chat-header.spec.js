import { shallowMount, mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import ChatHeader
  from '../chat-header.vue';

const store = createStore({
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
    global: { plugins: [store] },
  };
  it('renders a component', () => {
    const wrapper = shallowMount(ChatHeader, mountOptions);
    expect(wrapper.exists()).toBe(true);
  });

  it('$emits openTab event at transfer button click', () => {
    const wrapper = mount(ChatHeader, {
      ...mountOptions,
      computed: {
        isTransferAction() {
          return true;
        },
      },
    });
    wrapper.findAllComponents({ name: 'wt-rounded-action' })
           .find((wrapper) => wrapper.attributes('icon')
             === 'chat-transfer--filled')
           .vm.$emit('click');
    expect(wrapper.emitted().openTab[0]).toEqual(['transfer']);
  });

  it('calls close() method at close chat button click', () => {
    const closeMock = jest.spyOn(ChatHeader.methods, 'close')
                          .mockImplementation(() => {
                          });
    const wrapper = mount(ChatHeader, mountOptions);
    wrapper.findComponent({ name: 'chat-header-close-action' })
           .vm.$emit('click');
    expect(closeMock).toHaveBeenCalled();
  });
});
