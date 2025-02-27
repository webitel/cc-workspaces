import { shallowMount } from '@vue/test-utils';
import TaskQueuePreviewSm from '../task-queue-preview-sm.vue';

const task = {
  id: '1',
  members: [{ name: 'jest' }],
  messages: [{ text: 'jest1' }, { text: 'jest2' }],
};

describe('TaskQueuePreviewSm', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(TaskQueuePreviewSm, { props: { task } });
    expect(wrapper.exists()).toBe(true);
  });
});
