import { createStore } from 'vuex';
import { shallowMount, mount } from '@vue/test-utils';
import FlowsTab
  from '../flows-tab.vue';
import FlowsAPI from '../../api/flows.js';
import axiosMock from '@webitel/ui-sdk/src/tests/mocks/axiosMock';
import instance from '../../../../../../../app/api/instance';

const flowsData = [{
    id: 1,
    name: 'flow1'
  }, {
    id: 2,
    name: 'flow2'
  }];

vi.mock('../../api/flows.js');
FlowsAPI.getLookup.mockImplementation(() => Promise.resolve({ items: flowsData }));

const team = { id: 262, name: 'team1' };
// const flowsList = [{ id: 1, name: 'flow1' }, { id: 2, name: 'flow2' }];
const store = createStore({
  modules: {
    ui: {
      namespaced: true,
      modules: {
        infoSec: {
          namespaced: true,
          modules: {
            flows: {
              namespaced: true,
              getters: {
                AGENT_TEAM: () => team,
              },
              // state: {
              //   flows: [],
              // },
            },
          },
        },
      },
    },
  },
});

describe('FlowsTab', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(FlowsTab, {
      global: { plugins: [store] },
      computed: {
        ...FlowsTab.computed,
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
  it('renders flows list', async () => {
    const wrapper = shallowMount(FlowsTab, {
      global: { plugins: [store] },
      data() {
        return {
          isLoaded: true,
          flowsList: FlowsAPI.getLookup,
        }
      }
    });

    await wrapper.vm.$nextTick();
    expect(FlowsAPI.getLookup).toHaveBeenCalled();
    const items = FlowsAPI.getLookup;
    const list = wrapper
      .findAll('.flow-item');
    console.info('llli', wrapper.html(), "items:", items);
    // expect(wrapper.).toBe(2);
  });
  // it('show dummy', () => {
  //   const wrapper = shallowMount(FlowsTab, {
  //     global: { plugins: [store] },
  //   });
  //   const dummy = wrapper.find('.flow-item__dummy');
  //   expect(dummy.exists()).toBe(true);
  // });
});
