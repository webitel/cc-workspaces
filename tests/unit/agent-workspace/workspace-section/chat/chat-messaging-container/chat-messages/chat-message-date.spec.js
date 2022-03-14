import { shallowMount } from '@vue/test-utils';
import MessageDate
  from '../../../../../../../src/components/agent-workspace/workspace-section/chat/chat-messaging-container/chat-messages/chat-message-date.vue';

const time = Date.now();
describe('Chat Message Date component', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(MessageDate, { propsData: { time } });
    expect(wrapper.exists()).toBe(true);
  });
});
