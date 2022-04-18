import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import workspaceModule from '../../../../../../../store/agent-workspace';
import callModule from '../../../../../../../../features/modules/call/call';
import ActiveQueue
  from '../active-queue-container.vue';
import ActivePreview
  from '../active-queue-preview.vue';
import MockSocket from '../../../../../../../../../tests/unit/mocks/MockSocket';
import webSocketClientController
  from '../../../../../../../../app/api/agent-workspace/websocket/WebSocketClientController';

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
        features: {
          namespaced: true,
          modules: {
            call: {
              namespaced: true,
              state,
              actions,
              mutations,
            },
          },
        },
      },
    });
  });

  it('Draws new call when ringing event fires', async () => {
    const wrapper = shallowMount(ActiveQueue, {
      store,
      localVue,
    });
    await wrapper.vm.$store.dispatch('features/call/SUBSCRIBE_CALLS');
    await mockSocket.ringing({});
    expect(wrapper.findAll(ActivePreview).length).toEqual(2);
  });

  it('Removes a call when ringing event fires', async () => {
    const wrapper = shallowMount(ActiveQueue, {
      store,
      localVue,
    });
    await wrapper.vm.$store.dispatch('features/call/SUBSCRIBE_CALLS');
    await mockSocket.hangup(initialCall);
    expect(wrapper.findAll(ActivePreview).length).toEqual(0);
  });
});
