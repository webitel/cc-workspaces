import { shallowMount } from '@vue/test-utils';
import ReactiveNowStoreModule
  from '@webitel/ui-sdk/src/store/ReactiveNowStoreModule/ReactiveNowStoreModule';
import { createStore } from 'vuex';
import { CallDirection } from 'webitel-sdk';
import workspaceModule from '../../store/agent-workspace';
import callModule from '../../../features/modules/call/call';
import statusModule from '../../../features/modules/agent-status/agent-status';
import userinfoModule from '../../modules/userinfo/userinfo';
import Workspace from '../the-agent-workspace.vue';
import Call
  from '../../modules/work-section/modules/call/components/the-call.vue';
import MockSocket from '../../../../tests/unit/mocks/MockSocket';
import webSocketClientController
  from '../../../app/api/agent-workspace/websocket/WebSocketClientController';

let call = {};
const mockSocket = new MockSocket();

vi.spyOn(webSocketClientController, 'getCliInstance').mockImplementation(() => mockSocket);

describe.skip('Hangup event on call component', () => {
  const { state, actions, mutations } = callModule;
  let store;

  beforeEach(() => {
    store = createStore({
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
        now: new ReactiveNowStoreModule().getModule(),
        status: statusModule,
        userinfo: userinfoModule,
      },
    });
  });

  it('Removes Call component when hangup event fires', async () => {
    const wrapper = shallowMount(Workspace, {
      global: { plugins: [store] },
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
      global: { plugins: [store] },
    });
    await wrapper.vm.$store.dispatch('features/call/SUBSCRIBE_CALLS');
    await mockSocket.ringing(call);
    await mockSocket.hangup(call);
    expect(wrapper.find(Call)
      .exists())
      .toBeFalsy();
  });

  it('ignores all drop events', () => {
    const wrapper = shallowMount(Workspace, {
      global: { plugins: [store] },
    });
    const event = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    };
    wrapper.vm.preventDrop(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });
});
