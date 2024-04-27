import { mount, shallowMount } from '@vue/test-utils';
import FlowsTab
  from '../flows-tab.vue';
import Vuex, { createStore } from 'vuex';


describe('FlowsTab', () => {
  let state;
  let store;
  beforeEach(() => {
    state = {
      flows: [],
    };
    store = createStore({
      state,
      modules: {
        // workspace: {
        //   state: {
        //     workspaceState: WorkspaceStates.CALL,
        //   },
        //   ...workspaceModule,
        // },
        // call: {
        //   namespaced: true,
        //   state,
        // },
      },
    });
  });

  it('renders a component', () => {
    const wrapper = shallowMount(FlowsTab, {
      global: { plugins: [store] },
      computed: {
        ...FlowsTab.computed,
        team: () => {},
        // showProcessing: () => true,
        // showFlows: () => true,
        // taskOnWorkspace: () => callOnWorkspace,
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
  // it('renders flows list', () => {
  //   const flows = [{ id: 1, name: 'flow1' }, { id: 2, name: 'flow2' }];
  //   const wrapper = mount(FlowsTab, {
  //     propsData: {
  //       flowsList: flows,
  //     }
  //   });
  //   const flowsItems = wrapper
  //     .findAll('.flow-item')
  //     .at(1);
  //   expect(flowsItems.length).toBe(2);
  //   expect(flowsItems.find('.flow-item__name').at(2).text()).toBe('flow1');
  //   expect(flowsItems.find('.flow-item__name').at(1).text()).toBe('flow2');
  // });
  // it('show dummy', () => {
  //   const flows = [];
  //   const wrapper = mount(FlowsTab, {
  //     propsData: {
  //       flowsList: flows,
  //     }
  //   });
  //   const dummy = wrapper.find('.flow-item__dummy');
  //   expect(dummy.exists()).toBe(true);
  // });
});
