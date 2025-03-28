import { shallowMount } from '@vue/test-utils';

import ChatMessageTime
  from '../chat-message-time.vue';

let date = '';

describe('ChatMessageMeta component', () => {
  beforeEach(() => {
    date = '';
  });

  it('renders a component', () => {
    const wrapper = shallowMount(ChatMessageTime, { props: { date } });
    expect(wrapper.exists()).toBe(true);
  });

  it('correctly computes time', () => {
    date = '0';
    const wrapper = shallowMount(ChatMessageTime, { props: { date } });
    expect(wrapper.vm.time).toBeTruthy();
  });
});
