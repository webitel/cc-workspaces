import { shallowMount } from '@vue/test-utils';
import TaskQueuePreviewMd from '../task-queue-preview-md.vue';

const task = {
  id: '1',
  members: [{ name: 'jest' }],
  messages: [{ text: 'jest1' }, { text: 'jest2' }],
};

describe('TaskQueuePreviewMd', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(TaskQueuePreviewMd, { propsData: { task } });
    expect(wrapper.exists()).toBe(true);
  });

  it('Correctly displays task displayQueueName', () => {
    const queueName = 'jest3';
    const testTask = { ...task, attempt: { queue: { name: queueName } } };
    const wrapper = shallowMount(TaskQueuePreviewMd, {
      propsData: { task: testTask },
    });
    expect(wrapper.findComponent({ name: 'wt-chip' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'wt-chip' }).text()).toBe(queueName);
  });
});