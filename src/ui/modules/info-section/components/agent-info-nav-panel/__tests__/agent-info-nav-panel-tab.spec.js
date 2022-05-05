import { shallowMount } from '@vue/test-utils';
import AgentInfoNavPanelTab from '../agent-info-nav-panel-tab.vue';

describe('AgentInfoNavPanelTab', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(AgentInfoNavPanelTab, {
      propsData: { icon: 'jest' },
    });
    expect(wrapper.isVisible()).toBe(true);
  });
});
