import { shallowMount } from '@vue/test-utils';
import JobQueuePreview from '../active/job-queue-preview.vue';

const task = {
};

describe('JobQueuePreview', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(JobQueuePreview, { props: { task } });
    expect(wrapper.exists()).toBe(true);
  });
});
