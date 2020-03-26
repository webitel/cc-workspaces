import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import workspaceModule from '../../../../../src/store/modules/agent-workspace/agent-workspace';
import CallStates from '../../../../../src/store/callUtils/CallStates';
import CallPreview
  from '../../../../../src/components/agent-workspace/workspace-section/call/call-preview.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Transfer functionality', () => {
  let state;
  const { actions, mutations } = workspaceModule;
  let store;

  beforeEach(() => {
    state = {};
    store = new Vuex.Store({
      modules: {
        workspace: {
          namespaced: true,
          state,
          actions,
          mutations,
        },
      },
    });
  });

  it('Opens transfer tab from call-preview', () => {
    const wrapper = shallowMount(CallPreview, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    const transferBtn = wrapper.find('.transfer');
    transferBtn.trigger('click');
    expect(state.callState)
      .toEqual(CallStates.TRANSFER);
  });
});
