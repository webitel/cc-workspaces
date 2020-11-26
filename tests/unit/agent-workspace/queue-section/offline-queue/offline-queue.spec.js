import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import workspaceModule from '../../../../../src/store/modules/agent-workspace/agent-workspace';
import memberModule from '../../../../../src/store/modules/member/member';
import OfflineQueue
  from '../../../../../src/components/agent-workspace/queue-section/call-queue/offline-queue/offline-queue-container.vue';
import OfflinePreview
  from '../../../../../src/components/agent-workspace/queue-section/call-queue/offline-queue/offline-queue-preview.vue';
import MockSocket from '../../../mocks/MockSocket';
import WorkspaceStates
  from '../../../../../src/store/modules/agent-workspace/workspaceUtils/WorkspaceStates';

const localVue = createLocalVue();
localVue.use(Vuex);

const initialCall = {};

const mockSocket = new MockSocket(initialCall);
jest.mock('../../../../../src/api/agent-workspace/call-ws-connection',
  () => ({ getCliInstance: () => mockSocket, destroyCliInstance: jest.fn() }));

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
