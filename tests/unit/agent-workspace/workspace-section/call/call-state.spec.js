import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import callModule from '../../../../../src/store/modules/call/call';
import CallState
  from '../../../../../src/components/agent-workspace/workspace-section/call/call-state.vue';
import workspaceModule from '../../../../../src/store/modules/agent-workspace/agent-workspace';
import webSocketClientController
  from '../../../../../src/api/agent-workspace/websocket/WebSocketClientController';

const localVue = createLocalVue();
localVue.use(Vuex);

// Make new call on number test
const mockCliCall = jest.fn();
jest.spyOn(webSocketClientController, 'getCliInstance')
  .mockImplementation(() => ({ call: mockCliCall }));

describe('Call state', () => {
  let state;
  const { getters, actions, mutations } = callModule;
  let store;

  beforeEach(() => {
    state = {
      callOnWorkspace: {},
    };
    store = new Vuex.Store({
      state: {
        client: webSocketClientController,
      },
      modules: {
        workspace: workspaceModule,
        call: {
          namespaced: true,
          state,
          getters,
          actions,
          mutations,
        },
      },
    });
  });

  it('Call state is empty on new call', async () => {
    state.callOnWorkspace = { state: 'Hold' };
    const wrapper = shallowMount(CallState, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    await wrapper.vm.$store.dispatch('call/OPEN_NEW_CALL', {});
    expect(wrapper.find('.numpad-state__primary-text').text()).toEqual('');
  });
});
