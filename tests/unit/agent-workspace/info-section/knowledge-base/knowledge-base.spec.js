import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { CallActions } from 'webitel-sdk';
import workspace from '../../../../../src/store/modules/agent-workspace/agent-workspace';
import call from '../../../../../src/store/modules/call/call';
import KnowledgeBaseTab
  from '../../../../../src/components/agent-workspace/info-section/knowledge-base/knowledge-base-tab.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('knowledge base info section tab', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        workspace,
        call,
      },
    });
  });

  it('renders a component', () => {
    const wrapper = shallowMount(KnowledgeBaseTab, {
      store,
      localVue,
    });
    expect(wrapper.exists()).toBe(true);
  });
});
