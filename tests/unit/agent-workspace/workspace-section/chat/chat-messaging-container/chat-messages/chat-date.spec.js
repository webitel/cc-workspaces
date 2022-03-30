import { shallowMount } from '@vue/test-utils';
import MessageDate
  from '../../../../../../../src/components/agent-workspace/workspace-section/chat/chat-messaging-container/chat-messages/chat-date.vue';

const time = Date.now();
describe('Chat Date component', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(MessageDate, { propsData: { time } });
    expect(wrapper.exists()).toBe(true);
  });
});
