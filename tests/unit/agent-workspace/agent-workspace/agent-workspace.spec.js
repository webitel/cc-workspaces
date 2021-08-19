import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import AgentWorkspace from '../../../../src/components/agent-workspace/the-agent-workspace.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({
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
      localVue,
      store,
      computed: {
        hasAccess() { return appAccess; },
      },
    });
    expect(wrapper.find('.main-agent-workspace').exists()).toBe(true);
  });

  it('error page is shown, if there is no access to workspace', () => {
    appAccess = false;
    const wrapper = shallowMount(AgentWorkspace, {
      localVue,
      store,
      computed: {
        hasAccess() { return appAccess; },
      },
    });
    expect(wrapper.findComponent({ name: 'wt-error-page' }).exists()).toBe(true);
  });
});
