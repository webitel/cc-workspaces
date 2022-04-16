import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import workspaceModule from '../../../../../../store/agent-workspace';
import memberModule from '../../../../../../../features/member/member';
import MemberCommunications
  from '../member-communications.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Member communications', () => {
  const { state, actions, mutations } = memberModule;
  let store;

  const member = {
    name: 'jest',
    communications: [
      {
        type: 'jest',
        destination: 'jest',
        id: 1,
      },
    ],
  };
  state.memberOnWorkspace = member;

  beforeEach(() => {
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

  it('Draws member communications from member communications list', async () => {
    const wrapper = shallowMount(MemberCommunications, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    expect(wrapper.findAll('.workspace-member-communication')
      .length)
      .toEqual(member.communications.length);
  });

  it('Selects member communication', async () => {
    const wrapper = shallowMount(MemberCommunications, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    wrapper.find('.workspace-member-communication').trigger('click');
    expect(memberModule.state.selectedCommId).toEqual(member.communications[0].id);
  });

  it('Draws border around selected communication', async () => {
    const wrapper = shallowMount(MemberCommunications, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    const comm = wrapper.find('.workspace-member-communication');
    comm.trigger('click');
    await wrapper.vm.$nextTick();
    expect(comm.classes()).toContain('selected');
  });
});
