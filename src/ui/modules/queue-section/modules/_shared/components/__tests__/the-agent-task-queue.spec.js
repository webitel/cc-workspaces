import { shallowMount } from '@vue/test-utils';
import TheAgentTaskQueue from '../the-agent-task-queue.vue';

describe('TheAgentTaskQueue', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(TheAgentTaskQueue);
    expect(wrapper.exists()).toBe(true);
  });
});
