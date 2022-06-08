import { shallowMount } from '@vue/test-utils';
import TheChat
  from '../the-chat.vue';

describe('The Chat', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(TheChat);
    expect(wrapper.exists()).toBe(true);
  });
});
