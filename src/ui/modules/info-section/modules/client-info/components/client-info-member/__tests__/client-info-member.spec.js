import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import ClientInfoMember
  from '../client-info-member.vue';
import WorkspaceStates
  from '../../../../../../../enums/WorkspaceState.enum';
import workspaceModule from '../../../../../../../store/agent-workspace';

describe('Client Info Member from Call', () => {
  let state;
  let store;
  const computed = {
    callVariables() {
      return [];
    },
    memberDescription() {
      return 'description';
    },
  };

  beforeEach(() => {
    state = {
      callOnWorkspace: {
        variables: {},
      },
    };
    store = createStore({
      state,
      modules: {
        workspace: {
          state: {
            workspaceState: WorkspaceStates.CALL,
          },
          ...workspaceModule,
        },
        call: {
          namespaced: true,
          state,
        },
      },
    });
  });

  it('Correctly renders empty variables', () => {
    const wrapper = mount(ClientInfoMember, {
      global: { plugins: [store] },
      computed,
    });
    expect(wrapper.find('.client-info-member-item').exists()).toBe(false);
  });

  it('Correctly renders member description', () => {
    const wrapper = mount(ClientInfoMember, {
      global: { plugins: [store] },
      computed,
    });
    expect(wrapper.find('.client-info-member-description').text()).toEqual('description');
  });
});
