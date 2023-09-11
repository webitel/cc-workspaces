import { shallowMount } from '@vue/test-utils';
import GeneralInfoTab from '../general-info-tab.vue';

const agent = {};

const computed = {
  agent: () => agent,
  agentInfo: () => ({
    queues: [],
    pauseCauses: [],
    agent,
  }),
};

describe('General Info Tab', () => {
  it('renders a component', () => {
    jest.spyOn(GeneralInfoTab.methods, 'loadAgentInfo').mockImplementation(jest.fn());
    const wrapper = shallowMount(GeneralInfoTab, { computed });
    expect(wrapper.exists()).toBe(true);
  });
});
