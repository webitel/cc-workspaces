import { shallowMount } from '@vue/test-utils';
import AgentQueues from '../../../../../src/components/agent-workspace/info-section/general-info/agent-queues.vue';

describe('General Info: Agent Queues', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(AgentQueues, {
      propsData: {
        queues: [],
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
