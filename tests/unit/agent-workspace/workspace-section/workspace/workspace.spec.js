import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { CallDirection } from 'webitel-sdk';
import workspaceModule from '../../../../../src/store/modules/agent-workspace/agent-workspace';
import callModule from '../../../../../src/store/modules/call/call';
import nowModule from '../../../../../src/store/modules/reactive-now/reactive-now';
import statusModule from '../../../../../src/store/modules/agent-status/agent-status';
import userinfoModule from '../../../../../src/store/modules/userinfo/userinfo';
import Workspace from '../../../../../src/components/agent-workspace/the-agent-workspace.vue';
import Call
  from '../../../../../src/components/agent-workspace/workspace-section/call/the-call.vue';
import MockSocket from '../../../mocks/MockSocket';
import webSocketClientController
  from '../../../../../src/api/agent-workspace/WebSocketClientController';

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
    await wrapper.vm.$store.dispatch('call/SUBSCRIBE_CALLS');
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
    await wrapper.vm.$store.dispatch('call/SUBSCRIBE_CALLS');
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
