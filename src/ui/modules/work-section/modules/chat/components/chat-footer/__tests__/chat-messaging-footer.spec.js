import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import ChatMessagingFooter from '../chat-footer.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
let chatOnWorkspace = {
  closedAt: 0,
};
const computed = {
  isChatPreview: () => true,
  isChatActive: () => false,
  chat: () => chatOnWorkspace,
};

describe('Chat Messaging Footer: Chat Preview', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(ChatMessagingFooter, {
      computed,
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders chat preview actions if isChatActive computed is falsy', () => {
    const wrapper = shallowMount(ChatMessagingFooter, {
      computed,
    });
    expect(wrapper.find('.chat-footer__chat-preview').exists()).toBe(true);
    expect(wrapper.find('.chat-footer__chat-active').exists()).toBe(false);
    expect(wrapper.find('.chat-footer__chat-closed').exists()).toBe(false);
  });

  it('calls accept() chat method at accept chat button click', () => {
    const acceptMock = jest.spyOn(ChatMessagingFooter.methods, 'accept')
    .mockImplementation(() => {
    });
    const wrapper = shallowMount(ChatMessagingFooter, {
      computed,
    });
    wrapper.getComponent({ name: 'wt-button' }).vm.$emit('click');
    expect(acceptMock).toHaveBeenCalled();
  });
});

describe('Chat Messaging Footer: Active Chat', () => {
  it('renders active chat actions if isChatActive computed is truthy', () => {
    const wrapper = shallowMount(ChatMessagingFooter, {
      computed: {
        ...computed,
        isChatPreview: () => false,
        isChatActive: () => true,
      },
    });
    expect(wrapper.find('.chat-footer__chat-active').exists()).toBe(true);
    expect(wrapper.find('.chat-footer__chat-preview').exists()).toBe(false);
    expect(wrapper.find('.chat-footer__chat-closed').exists()).toBe(false);
  });

  // TODO: FIX THIS TEST ON BAMBOO :/
  // it('calls send() store method at draft textarea input + enter', () => {
  //   const message = 'jest';
  //   const sendMock = jest.spyOn(ChatMessagingFooter.methods, 'send').mockImplementation(() => {});
  //   const wrapper = shallowMount(ChatMessagingFooter, {
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
    const sendFileMock = jest.spyOn(ChatMessagingFooter.methods, 'sendFile')
    .mockImplementation(() => {
    });
    const file = { name: 'jest' };
    const event = {
      clipboardData: {
        items: [{ getAsFile: () => file }],
      },
      preventDefault() {
      },
    };
    const wrapper = shallowMount(ChatMessagingFooter, {
      computed: {
        ...computed,
        isChatPreview: () => false,
        isChatActive: () => true,
      },
    });
    wrapper.vm.handleFilePaste(event);
    expect(sendFileMock).toHaveBeenCalledWith([file]);
  });

  it('calls store sendFile method at input attachment', () => {
    const sendFileMock = jest.spyOn(ChatMessagingFooter.methods, 'sendFile')
    .mockImplementation(() => {
    });
    const files = [{ name: 'jest' }];
    const wrapper = shallowMount(ChatMessagingFooter, {
      computed: {
        ...computed,
        isChatPreview: () => false,
        isChatActive: () => true,
      },
    });
    wrapper.vm.handleAttachments({ target: { files } });
    expect(sendFileMock).toHaveBeenCalledWith(files);
  });
});

describe('Chat Messaging Footer: Chat Closed', () => {
  beforeEach(() => {
    chatOnWorkspace = {
      closedAt: 6154165456465,
    };
  });

  it('renders chat footer closer if closedAt computed is truthy', () => {
    const wrapper = shallowMount(ChatMessagingFooter, {
      computed: {
        ...computed,
        isChatPreview: () => false,
      },
    });
    expect(wrapper.find('.chat-footer__chat-preview').exists()).toBe(false);
    expect(wrapper.find('.chat-footer__chat-active').exists()).toBe(false);
    expect(wrapper.find('.chat-footer__chat-closed').exists()).toBe(true);
  });
});
