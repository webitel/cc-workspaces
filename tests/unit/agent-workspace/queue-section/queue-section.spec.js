import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import workspaceModule from '../../../../src/store/modules/agent-workspace/agent-workspace';
import CallStates from '../../../../src/store/callUtils/CallStates';
import QueueSection
  from '../../../../src/components/agent-workspace/queue-section/the-agent-queue-section.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Make new call functionality', () => {
  let state;
  const { actions, mutations } = workspaceModule;
  let store;

  beforeEach(() => {
    state = {
      callState: null,
      callList: [],
    };
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

  it('Opens new call on workspace on "new call" btn click', () => {
    const wrapper = shallowMount(QueueSection, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    const newCallBtn = wrapper.find('.call');
    newCallBtn.trigger('click');
    expect(state.callState)
      .toEqual(CallStates.NEW);
  });
});
