import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import workspaceModule from '../../../../src/store/modules/agent-workspace/agent-workspace';
import callModule from '../../../../src/store/modules/call/call';
import CallStates from '../../../../src/store/modules/call/callUtils/CallStates';
import QueueSection
  from '../../../../src/components/agent-workspace/queue-section/the-agent-queue-section.vue';
import ActiveQueue
  from '../../../../src/components/agent-workspace/queue-section/active-queue/active-queue-container.vue';
import ActivePreview
  from '../../../../src/components/agent-workspace/queue-section/active-queue/active-queue-preview.vue';
import MockSocket from '../../mocks/MockSocket';

const localVue = createLocalVue();
localVue.use(Vuex);

const initialCall = {};

const mockSocket = new MockSocket(initialCall);
jest.mock('../../../../src/api/agent-workspace/call-ws-connection',
  () => () => mockSocket);

describe('Make new call functionality', () => {
  let state;
  const { actions, mutations } = callModule;
  let store;

  beforeEach(() => {
    state = {
      callState: null,
      callList: [],
    };
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

describe('Ringing and Hangup events call functionality', () => {
  let state;
  const { actions, mutations } = callModule;
  let store;

  beforeEach(() => {
    state = {
      callList: [initialCall],
    };
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

  it('Draws new call when ringing event fires', async () => {
    const wrapper = shallowMount(ActiveQueue, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    await wrapper.vm.$store.dispatch('call/SUBSCRIBE_CALLS');
    await mockSocket.ringing({});
    expect(wrapper.findAll(ActivePreview).length).toEqual(2);
  });

  it('Removes a call when ringing event fires', async () => {
    const wrapper = shallowMount(ActiveQueue, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    await wrapper.vm.$store.dispatch('call/SUBSCRIBE_CALLS');
    await mockSocket.hangup(initialCall);
    expect(wrapper.findAll(ActivePreview).length).toEqual(0);
  });
});
