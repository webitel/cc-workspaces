import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import callModule from '../../../../../../../features/call/call';
import CallState
  from '../call-state.vue';
import workspaceModule from '../../../../../../store/agent-workspace';
import webSocketClientController
  from '../../../../../../../app/api/agent-workspace/websocket/WebSocketClientController';

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
