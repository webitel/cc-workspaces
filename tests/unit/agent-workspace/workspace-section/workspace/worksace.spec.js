import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { CallDirection } from 'webitel-sdk';
import workspaceModule from '../../../../../src/store/modules/agent-workspace/agent-workspace';
import callModule from '../../../../../src/store/modules/call/call';
import nowModule from '../../../../../src/store/modules/reactive-now/reactive-now';
import statusModule from '../../../../../src/store/modules/agent-status/agent-status';
import Workspace from '../../../../../src/components/agent-workspace/the-agent-workspace.vue';
import Call
  from '../../../../../src/components/agent-workspace/workspace-section/call/the-call.vue';
import MockSocket from '../../../mocks/MockSocket';

const localVue = createLocalVue();
localVue.use(Vuex);

let call = {};
const mockSocket = new MockSocket();
jest.mock('../../../../../src/api/agent-workspace/call-ws-connection',
  () => () => mockSocket);

describe('Hangup event on call component', () => {
  const { state, actions, mutations } = callModule;
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
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
      },
    });
  });

  it('Removes Call component when hangup event fires', async () => {
    const wrapper = shallowMount(Workspace, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    await wrapper.vm.$store.dispatch('call/SUBSCRIBE_CALLS');
    const call = {};
    await mockSocket.ringing(call);
    await mockSocket.hangup(call);
    expect(wrapper.find(Call)
      .exists())
      .toBeFalsy();
  });

  it('Removes Call component when Inbound Call hangup event fires', async () => {
    call = { direction: CallDirection.Inbound };
    const wrapper = shallowMount(Workspace, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    await wrapper.vm.$store.dispatch('call/SUBSCRIBE_CALLS');
    await mockSocket.ringing(call);
    await mockSocket.hangup(call);
    expect(wrapper.find(Call)
      .exists())
      .toBeFalsy();
  });
});
