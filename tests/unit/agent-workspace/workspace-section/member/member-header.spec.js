import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import workspaceModule from '../../../../../src/store/modules/agent-workspace/agent-workspace';
import memberModule from '../../../../../src/store/modules/member/member';
import MemberHeader
  from '../../../../../src/components/agent-workspace/workspace-section/member/member-header.vue';
import MockSocket from '../../../mocks/MockSocket';
import webSocketClientController
  from '../../../../../src/api/agent-workspace/websocket/WebSocketClientController';

const localVue = createLocalVue();
localVue.use(Vuex);

const mockSocket = new MockSocket();
jest.spyOn(webSocketClientController, 'getCliInstance')
  .mockImplementation(() => mockSocket);

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
      state: {
        client: webSocketClientController,
      },
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
    });
    const callBtn = wrapper.findAllComponents({ name: 'wt-rounded-action' }).at(1);
    expect(callBtn.classes()).not.toContain('hidden');
  });

  it('Calls to member', () => {
    state.selectedCommId = 1;
    const wrapper = shallowMount(MemberHeader, {
      store,
      localVue,
    });
    const callBtn = wrapper.findAllComponents({ name: 'wt-rounded-action' }).at(1);
    callBtn.vm.$emit('click');
    expect(agent.directMember).toHaveBeenCalled();
    expect(agent.directMember.mock.calls[0]).toEqual([member.id, state.selectedCommId]);
  });
});
