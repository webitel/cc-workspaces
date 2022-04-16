import { shallowMount } from '@vue/test-utils';
import MessageDate
  from '../../../../../../../src/ui/modules/work-section/modules/chat/components/chat-messaging-container/chat-messages/chat-date.vue';

const time = Date.now();
describe('Chat Date component', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(MessageDate, { propsData: { time } });
    expect(wrapper.exists()).toBe(true);
  });
});
