import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import ClientInfoMember
  from '../client-info-member.vue';
import WorkspaceStates
  from '../../../../../../../features/enums/WorkspaceState.enum.js';
import workspaceModule from '../../../../../../store/agent-workspace.js';

describe('Client Info Member from Call', () => {
  let state;
  let store;
  const computed = {
    variables() {
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
