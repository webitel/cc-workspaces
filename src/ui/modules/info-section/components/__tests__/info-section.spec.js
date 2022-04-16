import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { CallActions } from 'webitel-sdk';
import reporting from '../../../../../features/reporting/store/post-processing';
import workspace from '../../../../store/agent-workspace';
import call from '../../../../../features/call/call';
import InfoSection
  from '../the-agent-info-section.vue';
import ClientInfoTab
  from '../../modules/client-info/components/client-info-tab.vue';
import MockSocket from '../../../../../../tests/unit/mocks/MockSocket';
import WorkspaceStates from '../../../../store/workspaceUtils/WorkspaceStates';
import webSocketClientController from '../../../../../app/api/agent-workspace/websocket/WebSocketClientController';

const localVue = createLocalVue();
localVue.use(Vuex);

const callOnWorkspace = { state: CallActions.Active, allowReporting: true };
const mockSocket = new MockSocket(callOnWorkspace);

jest.spyOn(webSocketClientController, 'getCliInstance').mockImplementation(() => mockSocket);

describe('Open Post Processing automatically after hangup', () => {
  let state;
  let store;

  beforeEach(() => {
    state = {
      client: webSocketClientController,
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
