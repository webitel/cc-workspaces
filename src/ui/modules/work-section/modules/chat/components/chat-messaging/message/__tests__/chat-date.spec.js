import { shallowMount } from '@vue/test-utils';
import MessageDate
  from '../chat-message-date.vue';

const time = Date.now();
describe('Chat Date component', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(MessageDate, { props: { time } });
    expect(wrapper.exists()).toBe(true);
  });
});
