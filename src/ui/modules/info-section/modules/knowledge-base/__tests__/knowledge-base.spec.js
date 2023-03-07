import { createStore } from 'vuex';
import { shallowMount } from '@vue/test-utils';
import workspace from '../../../../../store/agent-workspace';
import call from '../../../../../../features/modules/call/call';
import KnowledgeBaseTab
  from '../knowledge-base-tab.vue';

describe('knowledge base info section tab', () => {
  let store;

  beforeEach(() => {
    store = createStore({
      modules: {
        workspace,
        call,
      },
    });
  });

  it('renders a component', () => {
    const wrapper = shallowMount(KnowledgeBaseTab, {
      global: { plugins: [store] },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
