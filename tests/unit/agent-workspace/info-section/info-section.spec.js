import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { CallActions } from 'webitel-sdk';
import reporting from '../../../../src/store/modules/post-processing/post-processing';
import workspace from '../../../../src/store/modules/agent-workspace/agent-workspace';
import callModule from '../../../../src/store/modules/call/call';
import InfoSection
  from '../../../../src/components/agent-workspace/info-section/the-agent-info-section.vue';
import PostProcessingTab
  from '../../../../src/components/agent-workspace/info-section/post-processing/post-processing-tab.vue';
import MockSocket from '../../mocks/MockSocket';

const localVue = createLocalVue();
localVue.use(Vuex);

const callOnWorkspace = { state: CallActions.Active, allowReporting: true };
const mockSocket = new MockSocket(callOnWorkspace);
jest.mock('../../../../src/api/agent-workspace/call-ws-connection',
  () => ({ getCliInstance: () => mockSocket, destroyCliInstance: jest.fn() }));

describe('Open Post Processing tab automatically after hangup', () => {
  let state;
  const { actions, mutations } = callModule;
  let store;

  beforeEach(() => {
    state = {
      callOnWorkspace,
    };
    store = new Vuex.Store({
      state,
      modules: {
        workspace,
        reporting,
        call: {
          namespaced: true,
          state,
          actions,
          mutations,
        },
      },
    });
  });

  it('Open Post Processing tab automatically after hangup', async () => {
    const wrapper = shallowMount(InfoSection, {
      store,
      localVue,
      mocks: {
        $t: () => {
        },
      },
    });
    await wrapper.vm.$store.dispatch('call/SUBSCRIBE_CALLS');
    expect(wrapper.findComponent(PostProcessingTab).exists()).toBeFalsy();
    await mockSocket.hangup(callOnWorkspace);
    expect(wrapper.findComponent(PostProcessingTab).exists()).toBeTruthy();
  });
});
