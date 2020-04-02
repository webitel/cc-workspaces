import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import workspaceModule from '../../../../../src/store/modules/agent-workspace/agent-workspace';
import memberModule from '../../../../../src/store/modules/member/member';
import MemberHeader
  from '../../../../../src/components/agent-workspace/workspace-section/member/member-header.vue';
import MockSocket from '../../../mocks/MockSocket';

const localVue = createLocalVue();
localVue.use(Vuex);

const mockSocket = new MockSocket();
jest.mock('../../../../../src/api/agent-workspace/call-ws-connection',
  () => () => mockSocket);

describe('Member header', () => {
  const {
    state, getters, actions, mutations,
  } = memberModule;
  let store;

  const member = {
    name: 'jest',
    id: 1,
  };
  const agent = {
    directMember: jest.fn(),
  };

  state.memberOnWorkspace = member;
  state.agent = agent;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        workspace: workspaceModule,
        member: {
          namespaced: true,
          state,
          getters,
          actions,
          mutations,
        },
      },
    });
  });

  it('Hides "Call" btn if no were communications selected', () => {
    const wrapper = shallowMount(MemberHeader, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    expect(wrapper.find('.call')
      .exists())
      .toBeFalsy();
  });

  it('Shows "Call" btn if communication was selected', () => {
    state.selectedCommId = 1;
    const wrapper = shallowMount(MemberHeader, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    expect(wrapper.find('.call')
      .exists())
      .toBeTruthy();
  });

  it('Calls to member', () => {
    state.selectedCommId = 1;
    const wrapper = shallowMount(MemberHeader, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    wrapper.find('.call').trigger('click');
    expect(agent.directMember).toHaveBeenCalled();
    expect(agent.directMember.mock.calls[0]).toEqual([member.id, state.selectedCommId]);
  });
});
