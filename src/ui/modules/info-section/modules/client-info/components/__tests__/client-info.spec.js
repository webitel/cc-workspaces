import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import WorkspaceStates
  from '../../../../../../enums/WorkspaceState.enum';
import workspaceModule from '../../../../../../store/agent-workspace';
import ClientInfo
  from '../client-info-tab.vue';

describe('Client Info Tab', () => {
  let state;
  let store;
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

  it('renders a component', () => {
    const wrapper = shallowMount(ClientInfo, {
      global: { plugins: [store] },
    });
    expect(wrapper.exists()).toBe(true);
  });
  it('renders a component client-info-chips', () => {
    const wrapper = shallowMount(ClientInfo, {
      global: { plugins: [store] },
    });
    expect(wrapper.findComponent({ name: 'client-info-chips' }).exists()).toBe(true);
  });

//   it('Correctly renders key-value in call variables', () => {
//     state.callOnWorkspace.variables = {
//       key: 'value',
//     };
//     const wrapper = shallowMount(ClientInfo, {
//       store,
//       localVue,
//     });
//     // const md = wrapper.find('.md');
//     // expect(md.find('h3').text()).toBe('key:');
//     // expect(md.find('p').text()).toBe('value');
//   });
//
//   it('Correctly renders key-value with MD in call variables', () => {
//     state.callOnWorkspace.variables = {
//       md: '# h1 Heading',
//     };
//     const wrapper = shallowMount(ClientInfo, {
//       store,
//       localVue,
//     });
//     const md = wrapper.find('.md');
//     expect(md.find('h3').text()).toBe('md:');
//     expect(md.find('h1').text()).toBe('h1 Heading');
//   });
// });
//
// describe('Client Info MD from Member', () => {
//   let state;
//   let store;
//
//   beforeEach(() => {
//     state = {
//       memberOnWorkspace: {
//         variables: {},
//       },
//     };
//     store = new Vuex.Store({
//       state,
//       modules: {
//         workspace: {
//           namespaced: true,
//           state: {
//             workspaceState: WorkspaceStates.MEMBER,
//           },
//         },
//         member: {
//           namespaced: true,
//           state,
//         },
//       },
//     });
//   });
//
//   it('Correctly renders key-value in member variables', () => {
//     state.memberOnWorkspace.variables = {
//       key: 'value',
//     };
//     const wrapper = shallowMount(ClientInfo, {
//       store,
//       localVue,
//     });
//     const md = wrapper.find('.md');
//     expect(md.find('h3').text()).toBe('key:');
//     expect(md.find('p').text()).toBe('value');
//   });
//
//   it('Correctly renders key-value with MD in member variables', () => {
//     state.memberOnWorkspace.variables = {
//       md: '# h1 Heading',
//     };
//     const wrapper = shallowMount(ClientInfo, {
//       store,
//       localVue,
//     });
//     const md = wrapper.find('.md');
//     expect(md.find('h3').text()).toBe('md:');
//     expect(md.find('h1').text()).toBe('h1 Heading');
//   });
});
