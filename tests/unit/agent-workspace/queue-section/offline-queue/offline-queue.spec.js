import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import workspaceModule from '../../../../../src/store/modules/agent-workspace/agent-workspace';
import memberModule from '../../../../../src/store/modules/member/member';
import OfflineQueue
  from '../../../../../src/components/agent-workspace/queue-section/offline-queue/offline-queue-container.vue';
import OfflinePreview
  from '../../../../../src/components/agent-workspace/queue-section/offline-queue/offline-queue-preview.vue';
import MockSocket from '../../../mocks/MockSocket';

const localVue = createLocalVue();
localVue.use(Vuex);

const initialCall = {};

const mockSocket = new MockSocket(initialCall);
jest.mock('../../../../../src/api/agent-workspace/call-ws-connection',
  () => () => mockSocket);

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

  it('Loads members and draws previews', async () => {
    const wrapper = shallowMount(OfflineQueue, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    await wrapper.vm.$nextTick(); // get agent session()
    await wrapper.vm.$nextTick(); // get offline members ()
    await wrapper.vm.$nextTick(); // rerender
    expect(wrapper.findAll(OfflinePreview).length).toEqual(2);
  });

  it('Opens selected member on workspace', async () => {
    state.membersList.push({});
    const wrapper = shallowMount(OfflineQueue, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    expect(wrapper.findAll(OfflinePreview).length).toEqual(1);
    wrapper.find(OfflinePreview).trigger('click');
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(workspaceModule.actions.SET_WORKSPACE_STATE).toHaveBeenCalled();
    expect(memberModule.mutations.SET_WORKSPACE).toHaveBeenCalled();
  });
});
