import { shallowMount } from '@vue/test-utils';
import ChatFooter
  from '../../../../../../../src/components/agent-workspace/workspace-section/chat/shared/chat-footer/chat-footer.vue';

  describe('Chat Footer: Chat Preview', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(ChatFooter, {
      computed: {
        isChatActive() { return false; },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders chat preview actions if isChatActive computed is falsy', () => {
    const wrapper = shallowMount(ChatFooter, {
      computed: {
        isChatActive() { return false; },
      },
    });
    expect(wrapper.find('.chat-footer__chat-preview').exists()).toBe(true);
    expect(wrapper.find('.chat-footer__chat-active').exists()).toBe(false);
  });

  it('calls accept() chat method at accept chat button click', () => {
    const acceptMock = jest.spyOn(ChatFooter.methods, 'accept').mockImplementation(() => {});
    const wrapper = shallowMount(ChatFooter, {
      computed: {
        isChatActive() { return false; },
      },
    });
    wrapper.getComponent({ name: 'wt-button' }).vm.$emit('click');
    expect(acceptMock).toHaveBeenCalled();
  });
});

  describe('Chat Footer: Active Chat', () => {
  it('renders active chat actions if isChatActive computed is truthy', () => {
    const wrapper = shallowMount(ChatFooter, {
      computed: {
        isChatActive() { return true; },
      },
    });
    expect(wrapper.find('.chat-footer__chat-active').exists()).toBe(true);
    expect(wrapper.find('.chat-footer__chat-preview').exists()).toBe(false);
  });

  it('calls send() store method at draft textarea input + enter', () => {
    const message = 'jest';
    const sendMock = jest.spyOn(ChatFooter.methods, 'send').mockImplementation(() => {});
    const wrapper = shallowMount(ChatFooter, {
      computed: {
        isChatActive() { return true; },
      },
    });
    const draftTextarea = wrapper.getComponent({ name: 'wt-textarea' }).vm;
    draftTextarea.$emit('input', message);
    draftTextarea.$emit('enter', message);
    expect(sendMock).toHaveBeenCalledWith(message);
  });
});
