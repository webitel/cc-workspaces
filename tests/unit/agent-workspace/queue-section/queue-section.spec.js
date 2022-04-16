import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import workspaceModule from '../../../../src/ui/store/agent-workspace';
import callModule from '../../../../src/features/call/call';
import memberModule from '../../../../src/features/member/member';
import QueueSection
  from '../../../../src/ui/modules/queue-section/components/the-agent-queue-section.vue';
import MockSocket from '../../mocks/MockSocket';
import webSocketClientController
  from '../../../../src/app/api/agent-workspace/websocket/WebSocketClientController';

const localVue = createLocalVue();
localVue.use(Vuex);

const initialCall = {};

const mockSocket = new MockSocket(initialCall);
jest.spyOn(webSocketClientController, 'getCliInstance')
  .mockImplementation(() => mockSocket);

describe('Make new call functionality', () => {
  let state;
  const { getters, actions, mutations } = callModule;
  let store;

  beforeEach(() => {
    state = {
      callOnWorkspace: {},
      callList: [],
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
          getters,
          actions,
          mutations,
          modules: callModule.modules,
        },
        member: memberModule,
      },
    });
  });

  it('Opens new call on workspace on "new call" btn click', () => {
    const wrapper = shallowMount(QueueSection, {
      store,
      localVue,
    });
    wrapper.findComponent({ name: 'wt-rounded-action' }).vm.$emit('click', {});
    expect(state.callOnWorkspace._isNew).toBeTruthy();
  });
});
