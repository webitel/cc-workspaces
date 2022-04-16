import { shallowMount } from '@vue/test-utils';
import AgentQueues from '../../../../../src/ui/modules/info-section/modules/general-info/components/agent-queues.vue';

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
