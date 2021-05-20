import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { CallActions } from 'webitel-sdk';
import reporting from '../../../../src/store/modules/post-processing/post-processing';
import workspace from '../../../../src/store/modules/agent-workspace/agent-workspace';
import call from '../../../../src/store/modules/call/call';
import InfoSection
  from '../../../../src/components/agent-workspace/info-section/the-agent-info-section.vue';
import ClientInfoTab
  from '../../../../src/components/agent-workspace/info-section/client-info/client-info-tab.vue';
import MockSocket from '../../mocks/MockSocket';
import WorkspaceStates from '../../../../src/store/modules/agent-workspace/workspaceUtils/WorkspaceStates';

const localVue = createLocalVue();
localVue.use(Vuex);

const callOnWorkspace = { state: CallActions.Active, allowReporting: true };
const mockSocket = new MockSocket(callOnWorkspace);
jest.mock('../../../../src/api/agent-workspace/call-ws-connection',
  () => ({ getCliInstance: () => mockSocket, destroyCliInstance: jest.fn() }));

describe('Open Post Processing automatically after hangup', () => {
  let state;
  let store;

  beforeEach(() => {
    state = {
      callOnWorkspace,
    };
    store = new Vuex.Store({
      state,
      modules: {
        workspace: {
          ...workspace,
          state: { workspaceState: WorkspaceStates.CALL },
        },
        reporting,
        call: {
          ...call,
          state,
        },
      },
    });
  });

  it('Open Client Info tab automatically after hangup', async () => {
    const wrapper = shallowMount(InfoSection, { store, localVue });
    await wrapper.vm.$store.dispatch('call/SUBSCRIBE_CALLS');
    expect(wrapper.findComponent(ClientInfoTab).exists()).toBeFalsy();
    await mockSocket.hangup(callOnWorkspace);
    expect(wrapper.findComponent(ClientInfoTab).exists()).toBeTruthy();
  });
});
