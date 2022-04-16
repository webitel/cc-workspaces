import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import workspaceModule from '../../../../../../src/ui/store/agent-workspace';
import callModule from '@/features/call/call';
import ActiveQueue
  from '@/ui/modules/queue-section/modules/call-queue/components/active-queue/active-queue-container.vue';
import ActivePreview
  from '@/ui/modules/queue-section/modules/call-queue/components/active-queue/active-queue-preview.vue';
import MockSocket from '../../../../mocks/MockSocket';
import webSocketClientController
  from '../../../../../../src/app/api/agent-workspace/websocket/WebSocketClientController';

const localVue = createLocalVue();
localVue.use(Vuex);

const initialCall = {};

const mockSocket = new MockSocket(initialCall);

jest.spyOn(webSocketClientController, 'getCliInstance').mockImplementation(() => mockSocket);

describe('Ringing and Hangup events call functionality', () => {
  let state;
  const { actions, mutations } = callModule;
  let store;

  beforeEach(() => {
    state = {
      callList: [initialCall],
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
    });
    await wrapper.vm.$store.dispatch('call/SUBSCRIBE_CALLS');
    await mockSocket.ringing({});
    expect(wrapper.findAll(ActivePreview).length).toEqual(2);
  });

  it('Removes a call when ringing event fires', async () => {
    const wrapper = shallowMount(ActiveQueue, {
      store,
      localVue,
    });
    await wrapper.vm.$store.dispatch('call/SUBSCRIBE_CALLS');
    await mockSocket.hangup(initialCall);
    expect(wrapper.findAll(ActivePreview).length).toEqual(0);
  });
});
