import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import ChatMessaging from '../../chat-messaging.vue';
import CurrentChat from '../current-chat.vue';

const chat = {
  messages: [],
};

const computed = {
  ...CurrentChat.computed,
};

const store = createStore({});
describe('Chat Messages Container', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(CurrentChat, {
      global: {
        plugins: [store],
      },
      computed,
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('showDate correctly computes Truthy value (different days)', () => {
    const messages = [
      { createdAt: new Date('1.1.2020').getTime() },
      { createdAt: new Date('2.1.2020').getTime() },
    ];
    chat.messages = messages;
    const wrapper = shallowMount(CurrentChat, {
      global: {
        plugins: [store],
      },
      computed,
    });
    expect(wrapper.vm.showChatDate(messages.length - 1)).toBe(true);
  });

  it('showDate correctly computes Falsy value (same day)', () => {
    const messages = [
      { createdAt: new Date('1.1.2020').getTime() },
      { createdAt: new Date('1.1.2020').getTime() },
    ];
    chat.messages = messages;
    const wrapper = shallowMount(CurrentChat, {
      global: {
        plugins: [store],
      },
      computed,
    });
    expect(wrapper.vm.showChatDate(messages.length - 1)).toBe(false);
  });

  it('showUserPic correctly computes Truthy value (different members)', () => {
    const member1 = { id: 1 };
    const member2 = { id: 2 };
    const messages = [{ member: member1 }, { member: member2 }];
    chat.messages = messages;
    const wrapper = shallowMount(CurrentChat, {
      global: {
        plugins: [store],
      },
      computed,
    });
    expect(wrapper.vm.showAvatar(messages.length - 1)).toBe(true);
  });

  it('showUserPic correctly computes Falsy value (same member)', () => {
    const member = { id: 1 };
    const messages = [{ member }, { member }];
    chat.messages = messages;
    const wrapper = shallowMount(CurrentChat, {
      global: {
        plugins: [store],
      },
      computed,
    });
    expect(wrapper.vm.showAvatar(messages.length - 1)).toBe(false);
  });
});
