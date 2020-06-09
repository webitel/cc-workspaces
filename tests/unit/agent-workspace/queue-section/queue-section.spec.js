import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import workspaceModule from '../../../../src/store/modules/agent-workspace/agent-workspace';
import callModule from '../../../../src/store/modules/call/call';
import memberModule from '../../../../src/store/modules/member/member';
import QueueSection
  from '../../../../src/components/agent-workspace/queue-section/the-agent-queue-section.vue';
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
      callOnWorkspace: {},
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
        member: memberModule,
      },
    });
  });

  it('Opens new call on workspace on "new call" btn click', () => {
    const wrapper = shallowMount(QueueSection, {
      store,
      localVue,
      mocks: { $t: () => {} },
      stubs: { Icon: true },
    });
    const newCallBtn = wrapper.find('.call');
    newCallBtn.trigger('click');
    expect(state.callOnWorkspace._isNew)
      .toBeTruthy();
  });
});
