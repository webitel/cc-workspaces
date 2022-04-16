import { shallowMount } from '@vue/test-utils';
import ChatMessagesContainer
  from '../../../../../../../src/ui/modules/work-section/modules/chat/components/chat-messaging-container/chat-messages/chat-messages-container.vue';

const chat = {
  messages: [],
};
describe('Chat Messages Container', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(ChatMessagesContainer, {
      computed: {
        chat() {
          return chat;
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('showDate correctly computes Truthy value (different days)', () => {
    const messages = [
      { createdAt: new Date('1.1.2020').getTime() },
      { createdAt: new Date('2.1.2020').getTime() },
    ];
    chat.messages = messages;
    const wrapper = shallowMount(ChatMessagesContainer, {
      computed: {
        chat() {
          return chat;
        },
      },
    });
    expect(wrapper.vm.showDate(messages.length - 1)).toBe(true);
  });

  it('showDate correctly computes Falsy value (same day)', () => {
    const messages = [
      { createdAt: new Date('1.1.2020').getTime() },
      { createdAt: new Date('1.1.2020').getTime() },
    ];
    chat.messages = messages;
    const wrapper = shallowMount(ChatMessagesContainer, {
      computed: {
        chat() {
          return chat;
        },
      },
    });
    expect(wrapper.vm.showDate(messages.length - 1)).toBe(false);
  });

  it('showUserPic correctly computes Truthy value (different members)', () => {
    const member1 = { id: 1 };
    const member2 = { id: 2 };
    const messages = [{ member: member1 }, { member: member2 }];
    chat.messages = messages;
    const wrapper = shallowMount(ChatMessagesContainer, {
      computed: {
        chat() {
          return chat;
        },
      },
    });
    expect(wrapper.vm.showDate(messages.length - 1)).toBe(true);
  });

  it('showUserPic correctly computes Falsy value (same member)', () => {
    const member = { id: 1 };
    const messages = [{ member }, { member }];
    chat.messages = messages;
    const wrapper = shallowMount(ChatMessagesContainer, {
      computed: {
        chat() {
          return chat;
        },
      },
    });
    expect(wrapper.vm.showAvatar(messages.length - 1)).toBe(false);
  });

  it('event bus emits input focus event at message container click', () => {
    const $eventBus = { $emit: jest.fn() };
    const wrapper = shallowMount(ChatMessagesContainer, {
      mocks: { $eventBus },
      computed: {
        chat() {
          return chat;
        },
      },
    });
   wrapper.find('.chat-messages-container').trigger('click');
    expect($eventBus.$emit).toHaveBeenCalledWith('chat-input-focus');
  });
});
