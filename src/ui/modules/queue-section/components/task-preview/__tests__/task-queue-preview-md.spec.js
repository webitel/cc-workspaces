import { shallowMount, mount } from '@vue/test-utils';
import TaskQueuePreviewMd from '../task-queue-preview-md.vue';

describe('TaskQueuePreviewMd', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(TaskQueuePreviewMd);
    expect(wrapper.exists()).toBe(true);
  });

  it('Correctly displays queue name, passed as prop', () => {
    const queueName = 'queue name';
    const wrapper = mount(TaskQueuePreviewMd, {
      props: { queueName },
    });
    expect(wrapper.find('.queue-preview-chips .wt-chip').text()).toBe(queueName);
  });
});
