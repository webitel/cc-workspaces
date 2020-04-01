import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
// import workspaceModule from '../../../../../src/store/modules/agent-workspace/agent-workspace';
import CallStates from '../../../../../src/store/modules/agent-workspace/call/callUtils/CallStates';
import ActiveCall
  from '../../../../../src/components/agent-workspace/workspace-section/call/active-call.vue';
import CallHeader
  from '../../../../../src/components/agent-workspace/workspace-section/call/call-header.vue';
import Numpad
  from '../../../../../src/components/agent-workspace/workspace-section/call/call-numpad/numpad.vue';
import Transfer
  from '../../../../../src/components/agent-workspace/workspace-section/shared/workspace-transfer/workspace-transfer-container.vue';
import Bridge
  from '../../../../../src/components/agent-workspace/workspace-section/shared/workspace-bridge/workspace-bridge-container.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Make new call functionality', () => {
  let state;
  // const { actions, mutations } = workspaceModule;
  let store;

  beforeEach(() => {
    state = {};
    store = new Vuex.Store({
      modules: {
        workspace: {
          namespaced: true,
          state,
        },
      },
    });
  });

  it('Draws a numpad on open', () => {
    const wrapper = shallowMount(ActiveCall, {
      store,
      localVue,
    });
    const numpad = wrapper.find(Numpad);
    expect(numpad.isVisible())
      .toBeTruthy();
  });
});

describe('Transfer functionality', () => {
  let state;
  // const { actions, mutations } = workspaceModule;
  let store;

  beforeEach(() => {
    state = {};
    store = new Vuex.Store({
      modules: {
        workspace: {
          namespaced: true,
          state,
        },
      },
    });
  });

  it('Opens transfer tab on event emit', async () => {
    const wrapper = shallowMount(ActiveCall, {
      store,
      localVue,
      stubs: { Icon: true },
    });

    const callHeader = wrapper.find(CallHeader);
    callHeader.vm.$emit('openTab', 'transfer');
    await wrapper.vm.$nextTick();

    expect(wrapper.find(Transfer)
      .exists())
      .toBeTruthy();
  });

  it('Opens transfer tab on CallState.TRANSFER', async () => {
    state.callState = CallStates.TRANSFER;
    const wrapper = shallowMount(ActiveCall, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find(Transfer)
      .exists())
      .toBeTruthy();
  });
});

describe('Bridge functionality', () => {
  let state;
  // const { actions, mutations } = workspaceModule;
  let store;

  beforeEach(() => {
    state = {};
    store = new Vuex.Store({
      modules: {
        workspace: {
          namespaced: true,
          state,
        },
      },
    });
  });

  it('Opens bridge tab on event emit', async () => {
    const wrapper = shallowMount(ActiveCall, {
      store,
      localVue,
      stubs: { Icon: true },
    });

    const callHeader = wrapper.find(CallHeader);
    callHeader.vm.$emit('openTab', 'bridge');
    await wrapper.vm.$nextTick();

    expect(wrapper.find(Bridge)
      .exists())
      .toBeTruthy();
  });
});
