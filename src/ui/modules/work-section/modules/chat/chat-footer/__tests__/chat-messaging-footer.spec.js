import { mount,shallowMount } from '@vue/test-utils';

import ChatMessagingFooter from '../chat-footer.vue';

let chatOnWorkspace = {
  closedAt: 0,
};
const computed = {
  ...ChatMessagingFooter.computed,
  isChatPreview: () => true,
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
    const wrapper = mount(ChatMessagingFooter, {
      computed,
    });
    expect(wrapper.find('.chat-footer__chat-preview').exists()).toBe(true);
  });

  it('calls accept() chat method at accept chat button click', () => {
    const acceptMock = vi.spyOn(ChatMessagingFooter.methods, 'accept')
    .mockImplementation(() => {
    });
    const wrapper = mount(ChatMessagingFooter, {
      computed,
    });
    wrapper.getComponent({ name: 'wt-button' }).vm.$emit('click');
    expect(acceptMock).toHaveBeenCalled();
  });
});

describe('Chat Messaging Footer: Chat Closed', () => {
  beforeEach(() => {
    chatOnWorkspace = {
      closedAt: 6154165456465,
    };
  });

  it('renders chat footer closer if closedAt computed is truthy', () => {
    const wrapper = mount(ChatMessagingFooter, {
      computed: {
        ...computed,
        isChatPreview: () => false,
      },
    });
    expect(wrapper.find('.chat-footer__chat-preview').exists()).toBe(false);
  });
});
