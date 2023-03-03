import { shallowMount } from '@vue/test-utils';
import AgentQueues from '../agent-queues.vue';

describe('General Info: Agent Queues', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(AgentQueues, {
      props: {
        queues: [],
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
