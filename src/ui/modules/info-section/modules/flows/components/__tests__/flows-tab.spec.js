import { createStore } from 'vuex';
import { shallowMount } from '@vue/test-utils';
import FlowsAPI from '../../api/flows.js';
import FlowsTab from '../flows-tab.vue';

const flowsData = [{
    id: 1,
    name: 'flow1'
  }, {
    id: 2,
    name: 'flow2'
  }];

const team = { id: 262, name: 'team1' };

vi.spyOn(FlowsAPI, 'getLookup').mockImplementation(() => ({ items: flowsData }));
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
    });

    await wrapper.vm.$nextTick();

    const list = wrapper
      .findAll('.flow-item');
    expect(list.length).toBe(2);
  });

  it('show dummy', () => {
    const wrapper = shallowMount(FlowsTab, {
      global: { plugins: [store] },
    });
    const dummy = wrapper.find('.flow-item__dummy');
    expect(dummy.exists()).toBe(true);
  });
});
