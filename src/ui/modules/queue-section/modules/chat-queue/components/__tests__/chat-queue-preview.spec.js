import { shallowMount } from '@vue/test-utils';
import ChatQueuePreview from '../chat-queue-preview.vue';

const displayName = 'jest';
const lastMessage = 'jest2';
const task = {
  id: '1',
  members: [{ name: 'jest' }],
  messages: [{ text: 'jest1' }, { text: 'jest2' }],
};

describe('ChatQueuePreview', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(ChatQueuePreview, { propsData: { task } });
    expect(wrapper.exists()).toBe(true);
  });

  it('correctly computes last message text', () => {
    const wrapper = shallowMount(ChatQueuePreview, { propsData: { task } });
    expect(wrapper.vm.lastMessage).toBe(lastMessage);
  });

  it('correctly computes last message text, if last message is file', () => {
    const filename = 'jest';
    const testTask = { ...task, messages: [{ file: { name: filename } }] };
    const wrapper = shallowMount(ChatQueuePreview, {
      propsData: { task: testTask },
    });
    expect(wrapper.vm.lastMessage).toBe(filename);
  });

  it('correctly computes chat participants name to display', () => {
    const wrapper = shallowMount(ChatQueuePreview, { propsData: { task } });
    expect(wrapper.vm.displayChatName).toBe(displayName);
  });

  it('if chat has no queue, queue chip is absent', () => {
    const testTask = { ...task, task: {} };
    const wrapper = shallowMount(ChatQueuePreview, {
      propsData: { task: testTask },
    });
    expect(wrapper.find('.queue-preview-chips').exists()).toBe(false);
  });
});
