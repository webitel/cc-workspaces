import { shallowMount } from '@vue/test-utils';
import AgentPauseCauses from '../agent-pause-causes.vue';

describe('General Info: Agent Pause Causes', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(AgentPauseCauses, {
      propsData: {
        pauseCauses: [],
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
