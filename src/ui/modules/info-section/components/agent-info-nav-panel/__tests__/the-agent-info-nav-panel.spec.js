import { shallowMount } from '@vue/test-utils';

import TheAgentInfoNavPanel from '../the-agent-info-nav-panel.vue';

describe('TheAgentInfoNavPanel', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(TheAgentInfoNavPanel);
    expect(wrapper.isVisible()).toBe(true);
  });
});
