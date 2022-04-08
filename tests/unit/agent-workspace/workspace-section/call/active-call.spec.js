import { shallowMount, createLocalVue } from '@vue/test-utils';
import { CallActions, CallDirection } from 'webitel-sdk';
import Vuex from 'vuex';
// import workspaceModule from '../../../../../src/store/modules/agent-workspace/agent-workspace';
import callModule from '../../../../../src/store/modules/call/call';
import TheCall
  from '../../../../../src/components/agent-workspace/workspace-section/call/the-call.vue';
import CallPreview
  from '../../../../../src/components/agent-workspace/workspace-section/call/call-preview.vue';
import CallHeader
  from '../../../../../src/components/agent-workspace/workspace-section/call/call-header.vue';
import Numpad
  from '../../../../../src/components/agent-workspace/workspace-section/call/call-numpad/numpad.vue';
import Transfer
  from '../../../../../src/components/agent-workspace/workspace-section/call/call-transfer/call-transfer-container.vue';
import Bridge
  from '../../../../../src/components/agent-workspace/workspace-section/call/call-merge/call-bridge-container.vue';
import workspaceModule from '../../../../../src/store/modules/agent-workspace/agent-workspace';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('callOnWorkspace on call component', () => {
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
      },
    });
  });

  it('Draws Active component when ringing event fires', async () => {
    state.callOnWorkspace = {
      direction: CallDirection.Inbound,
      state: CallActions.Ringing,
    };
    const wrapper = shallowMount(TheCall, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find(CallPreview)
      .exists())
      .toBeTruthy();
  });

  it('Draws Preview component when Outbound Call '
    + 'from preview dialer is set', async () => {
    state.callOnWorkspace = {
      direction: CallDirection.Outbound,
      queue: { queue_type: 'preview' },
      state: CallActions.Ringing,
    };
    const wrapper = shallowMount(TheCall, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    expect(wrapper.find(CallPreview)
      .exists())
      .toBeTruthy();
  });

  it('Draws Preview component when Inbound Call ringing call is set', async () => {
    state.callOnWorkspace = {
      direction: CallDirection.Inbound,
      state: CallActions.Ringing,
    };
    const wrapper = shallowMount(TheCall, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    expect(wrapper.find(CallPreview)
      .exists())
      .toBeTruthy();
  });
});

describe('Make new call functionality', () => {
  let state;
  // const { actions, mutations } = workspaceModule;
  let store;

  beforeEach(() => {
    state = {};
    store = new Vuex.Store({
      modules: {
        call: {
          namespaced: true,
          state,
        },
      },
    });
  });

  it('Draws a numpad on open', () => {
    state.callOnWorkspace = {
      _isNew: true,
    };
    const wrapper = shallowMount(TheCall, {
      store,
      localVue,
    });
    const numpad = wrapper.find(Numpad);
    expect(numpad.isVisible())
      .toBeTruthy();
  });
});

describe('Transfer functionality', () => {
  const { state } = callModule;
  // const { actions, mutations } = workspaceModule;
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        call: {
          namespaced: true,
          state,
        },
      },
    });
  });

  it('Opens transfer tab on event emit', async () => {
    state.callOnWorkspace = { state: CallActions.Active };
    const wrapper = shallowMount(TheCall, {
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

  it('Opens transfer tab on transfer event from preview', async () => {
    state.callOnWorkspace = {
      state: CallActions.Ringing,
      direction: CallDirection.Inbound,
    };
    const wrapper = shallowMount(TheCall, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    wrapper.find(CallPreview).vm.$emit('transfer');
    await wrapper.vm.$nextTick();
    expect(wrapper.find(Transfer)
      .exists())
      .toBeTruthy();
  });
});

describe('Bridge functionality', () => {
  const { state } = callModule;
  // const { actions, mutations } = workspaceModule;
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        call: {
          namespaced: true,
          state,
        },
      },
    });
  });

  it('Opens bridge tab on event emit', async () => {
    state.callOnWorkspace = {
      state: CallActions.Active,
    };
    const wrapper = shallowMount(TheCall, {
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
