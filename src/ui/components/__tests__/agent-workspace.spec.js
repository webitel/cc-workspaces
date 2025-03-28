import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import BreakpointPlugin from '../../../app/plugins/breakpoint.plugin';
import AgentWorkspace from '../the-agent-workspace.vue';

const store = createStore({
  modules: {
    workspace: { namespaced: true },
    userinfo: { namespaced: true },
    call: {
      namespaced: true,
      state: {
        callList: [],
      },
    },
  },
});

describe('Agent Workspace', () => {
  let appAccess = true;

  beforeEach(() => {
    appAccess = true;
  });

  it('renders a component', () => {
    const wrapper = shallowMount(AgentWorkspace, {
      global: { plugins: [store, BreakpointPlugin] },
      computed: {
        hasAccess() { return appAccess; },
      },
    });
    expect(wrapper.find('.main-agent-workspace').exists()).toBe(true);
  });

  it('error page is shown, if there is no access to workspace', () => {
    appAccess = false;
    const wrapper = shallowMount(AgentWorkspace, {
      global: { plugins: [store] },
      computed: {
        hasAccess() { return appAccess; },
      },
    });
    expect(wrapper.findComponent({ name: 'wt-error-page' }).exists()).toBe(true);
  });
});
