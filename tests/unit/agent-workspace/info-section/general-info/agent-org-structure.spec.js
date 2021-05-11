import { shallowMount } from '@vue/test-utils';
import AgentOrgStructure from '../../../../../src/components/agent-workspace/info-section/general-info/agent-org-structure.vue';

describe('General Info: Agent Org Structure', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(AgentOrgStructure, {
      propsData: {
        agent: {},
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
