import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { CallDirection } from 'webitel-sdk';
import workspaceModule from '../../store/agent-workspace';
import callModule from '../../../features/modules/call/call';
import nowModule from '../../modules/reactive-now/reactive-now';
import statusModule from '../../../features/modules/agent-status/agent-status';
import userinfoModule from '../../modules/userinfo/userinfo';
import Workspace from '../the-agent-workspace.vue';
import Call
  from '../../modules/work-section/modules/call/components/the-call.vue';
import MockSocket from '../../../../tests/unit/mocks/MockSocket';
import webSocketClientController
  from '../../../app/api/agent-workspace/websocket/WebSocketClientController';

const localVue = createLocalVue();
localVue.use(Vuex);

let call = {};
const mockSocket = new MockSocket();

jest.spyOn(webSocketClientController, 'getCliInstance').mockImplementation(() => mockSocket);

// TODO REMOVE "X' FROM NAME
xdescribe('Hangup event on call component', () => {
  const { state, actions, mutations } = callModule;
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      state: {
        client: webSocketClientController,
      },
      modules: {
        workspace: workspaceModule,
        call: {
          namespaced: true,
          state,
          actions,
          mutations,
        },
        now: nowModule,
        status: statusModule,
        userinfo: userinfoModule,
      },
    });
  });

  it('Removes Call component when hangup event fires', async () => {
    const wrapper = shallowMount(Workspace, {
      store,
      localVue,
    });
    await wrapper.vm.$store.dispatch('features/call/SUBSCRIBE_CALLS');
    const call = {};
    await mockSocket.ringing(call);
    await mockSocket.hangup(call);
    expect(wrapper.findComponent(Call)
      .exists())
      .toBeFalsy();
  });

  it('Removes Call component when Inbound Call hangup event fires', async () => {
    call = { direction: CallDirection.Inbound };
    const wrapper = shallowMount(Workspace, {
      store,
      localVue,
    });
    await wrapper.vm.$store.dispatch('features/call/SUBSCRIBE_CALLS');
    await mockSocket.ringing(call);
    await mockSocket.hangup(call);
    expect(wrapper.find(Call)
      .exists())
      .toBeFalsy();
  });

  it('ignores all drop events', () => {
    const wrapper = shallowMount(Workspace, { store, localVue });
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    };
    wrapper.vm.preventDrop(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });
});
