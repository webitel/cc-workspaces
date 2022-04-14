import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import workspaceModule from '@/store/modules/agent-workspace/agent-workspace';
import memberModule from '@/store/modules/member/member';
import OfflineQueue
  from '@/components/agent-workspace/queue-section/call-queue/offline-queue/offline-queue-container.vue';
import OfflinePreview
  from '@/components/agent-workspace/queue-section/call-queue/offline-queue/offline-queue-preview.vue';
import WorkspaceStates
  from '@/store/modules/agent-workspace/workspaceUtils/WorkspaceStates';
import MockSocket from '../../../../mocks/MockSocket';
import webSocketClientController
  from '../../../../../../src/api/agent-workspace/websocket/WebSocketClientController';

const localVue = createLocalVue();
localVue.use(Vuex);

const initialCall = {};

const mockSocket = new MockSocket(initialCall);
jest.spyOn(webSocketClientController, 'getCliInstance')
  .mockImplementation(() => mockSocket);

describe('Members list functionality', () => {
  let state;
  const { actions, mutations } = memberModule;
  let store;

  workspaceModule.actions.SET_WORKSPACE_STATE = jest.fn();
  memberModule.mutations.SET_WORKSPACE = jest.fn();

  beforeEach(() => {
    state = {
      membersList: [],
    };
    store = new Vuex.Store({
      modules: {
        state: {
          client: webSocketClientController,
        },
        workspace: workspaceModule,
        member: {
          namespaced: true,
          state,
          actions,
          mutations,
        },
      },
    });
  });

  it('Opens selected member on workspace', async () => {
    state.membersList.push({});
    const wrapper = shallowMount(OfflineQueue, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    expect(wrapper.findAllComponents(OfflinePreview).length).toEqual(1);
    wrapper.findComponent(OfflinePreview).trigger('click');
    expect(workspaceModule.actions.SET_WORKSPACE_STATE.mock.calls[0][1])
      .toEqual(WorkspaceStates.MEMBER);
    expect(memberModule.mutations.SET_WORKSPACE).toHaveBeenCalled();
  });
});
