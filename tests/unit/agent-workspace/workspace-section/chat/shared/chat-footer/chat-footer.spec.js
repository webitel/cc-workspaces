import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import ChatFooter
  from '../../../../../../../src/components/agent-workspace/workspace-section/chat/chat-messaging-container/chat-messaging-footer/chat-footer.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
const chat = {
  namespaced: true,
  getters: {
    ALLOW_CHAT_JOIN: () => true,
    IS_CHAT_ACTIVE: () => false,
  },
};

describe('Chat Footer: Chat Preview', () => {
  const store = new Vuex.Store({
    modules: { chat },
  });

  const mountOptions = {
    localVue,
    store,
  };

  it('renders a component', () => {
    const wrapper = shallowMount(ChatFooter, mountOptions);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders chat preview actions if isChatActive computed is falsy', () => {
    const wrapper = shallowMount(ChatFooter, mountOptions);
    expect(wrapper.find('.chat-footer__chat-preview').exists()).toBe(true);
    expect(wrapper.find('.chat-footer__chat-active').exists()).toBe(false);
  });

  it('calls accept() chat method at accept chat button click', () => {
    const acceptMock = jest.spyOn(ChatFooter.methods, 'accept').mockImplementation(() => {
    });
    const wrapper = shallowMount(ChatFooter, mountOptions);
    wrapper.getComponent({ name: 'wt-button' }).vm.$emit('click');
    expect(acceptMock).toHaveBeenCalled();
  });
});

describe('Chat Footer: Active Chat', () => {
  chat.getters.ALLOW_CHAT_JOIN = () => false;
  chat.getters.IS_CHAT_ACTIVE = () => true;
  const store = new Vuex.Store({
    modules: { chat },
  });

  const mountOptions = {
    localVue,
    store,
  };
  it('renders active chat actions if isChatActive computed is truthy', () => {
    const wrapper = shallowMount(ChatFooter, mountOptions);
    expect(wrapper.find('.chat-footer__chat-active').exists()).toBe(true);
    expect(wrapper.find('.chat-footer__chat-preview').exists()).toBe(false);
  });

  // TODO: FIX THIS TEST ON BAMBOO :/
  // it('calls send() store method at draft textarea input + enter', () => {
  //   const message = 'jest';
  //   const sendMock = jest.spyOn(ChatFooter.methods, 'send').mockImplementation(() => {});
  //   const wrapper = shallowMount(ChatFooter, {
  //     computed: {
  //       isChatActive() { return true; },
  //     },
  //   });
  //   const draftTextarea = wrapper.findComponent({ name: 'wt-textarea' }).vm;
  //   draftTextarea.$emit('input', message);
  //   draftTextarea.$emit('enter', message);
  //   expect(sendMock).toHaveBeenCalledWith(message);
  // });

  it('calls store sendFile method at textarea pasted attachment', () => {
    const sendFileMock = jest.spyOn(ChatFooter.methods, 'sendFile').mockImplementation(() => {
    });
    const file = { name: 'jest' };
    const event = {
      clipboardData: {
        items: [{ getAsFile: () => file }],
      },
      preventDefault() {
      },
    };
    const wrapper = shallowMount(ChatFooter, mountOptions);
    wrapper.vm.handleFilePaste(event);
    expect(sendFileMock).toHaveBeenCalledWith([file]);
  });

  it('calls store sendFile method at input attachment', () => {
    const sendFileMock = jest.spyOn(ChatFooter.methods, 'sendFile').mockImplementation(() => {
    });
    const files = [{ name: 'jest' }];
    const wrapper = shallowMount(ChatFooter, mountOptions);
    wrapper.vm.handleAttachments({ target: { files } });
    expect(sendFileMock).toHaveBeenCalledWith(files);
  });
});
