import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { CallDirection } from 'webitel-sdk';
import workspaceModule from '../../../../../src/store/modules/agent-workspace/agent-workspace';
import Call
  from '../../../../../src/components/agent-workspace/workspace-section/call/the-call.vue';
import CallPreview
  from '../../../../../src/components/agent-workspace/workspace-section/call/call-preview.vue';
import ActiveCall
  from '../../../../../src/components/agent-workspace/workspace-section/call/active-call.vue';
import MockSocket from '../../../mocks/MockSocket';

const localVue = createLocalVue();
localVue.use(Vuex);

let call = {};
const mockSocket = new MockSocket();
jest.mock('../../../../../src/api/agent-workspace/call-ws-connection',
  () => () => mockSocket);

describe('Ringing event on call component', () => {
  const { state, actions, mutations } = workspaceModule;
  let store;

  beforeEach(() => {
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

  it('Draws Active component when ringing event fires', async () => {
    const wrapper = shallowMount(Call, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    await wrapper.vm.$store.dispatch('workspace/SUBSCRIBE_CALLS');
    await mockSocket.ringing({});
    expect(wrapper.find(ActiveCall)
      .exists())
      .toBeTruthy();
  });

  it('Draws Preview component when Outbound Call '
    + 'from preview dialer ringing event fires', async () => {
    call = {
      direction: CallDirection.Outbound,
      queue: { queue_type: 'preview' },
    };
    const wrapper = shallowMount(Call, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    await wrapper.vm.$store.dispatch('workspace/SUBSCRIBE_CALLS');
    await mockSocket.ringing(call);
    expect(wrapper.find(CallPreview)
      .exists())
      .toBeTruthy();
  });

  it('Draws Preview component when Inbound Call ringing event fires', async () => {
    call = { direction: CallDirection.Inbound };
    const wrapper = shallowMount(Call, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    await wrapper.vm.$store.dispatch('workspace/SUBSCRIBE_CALLS');
    await mockSocket.ringing(call);
    expect(wrapper.find(CallPreview)
      .exists())
      .toBeTruthy();
  });
});

describe('Hangup event on call component', () => {
  const { state, actions, mutations } = workspaceModule;
  let store;

  beforeEach(() => {
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

  it('Removes Active component when ringing event fires', async () => {
    const wrapper = shallowMount(Call, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    await wrapper.vm.$store.dispatch('workspace/SUBSCRIBE_CALLS');
    const call = {};
    await mockSocket.ringing(call);
    await mockSocket.hangup(call);
    expect(wrapper.find(ActiveCall)
      .exists())
      .toBeFalsy();
  });

  it('Removes Preview component when Inbound Call ringing event fires', async () => {
    call = { direction: CallDirection.Inbound };
    const wrapper = shallowMount(Call, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    await wrapper.vm.$store.dispatch('workspace/SUBSCRIBE_CALLS');
    await mockSocket.ringing(call);
    await mockSocket.hangup(call);
    expect(wrapper.find(CallPreview)
      .exists())
      .toBeFalsy();
  });
});
