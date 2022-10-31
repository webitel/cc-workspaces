import { shallowMount } from '@vue/test-utils';
import TheChat
  from '../the-chat.vue';

describe('The Chat', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(TheChat, {
      computed: {
        chat() {
          return { id: '1', messages: [] };
          },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
