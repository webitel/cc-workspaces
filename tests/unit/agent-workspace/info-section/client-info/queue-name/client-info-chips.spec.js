import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import ClientInfoChips
  from '../../../../../../src/components/agent-workspace/info-section/client-info/queue-name/client-info-chips.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

const task = { task: {} };

const store = new Vuex.Store({
  modules: {
    workspace: {
      namespaced: true,
      getters: {
        TASK_ON_WORKSPACE: () => task,
      },
    },
  },
});

describe('client-info-chips.vue', () => {
  beforeEach(() => {
    task.task = {};
  });
  it('Should render component', () => {
    const wrapper = shallowMount(ClientInfoChips, {
      localVue,
      store,
    });
    expect(wrapper.exists()).toBe(true);
  });
  it('Should correctly display task QueueName', () => {
    const display = 'jest';
    task.task = {
      queue: {
        name: display,
      },
    };
    const wrapper = shallowMount(ClientInfoChips, {
      localVue,
      store,
    });
    expect(wrapper.findComponent({ name: 'wt-chip' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'wt-chip' }).text()).toBe(display);
  });
  it('if task has no queue, queue chip is absent', () => {
    const wrapper = shallowMount(ClientInfoChips, {
      localVue,
      store,
    });
    expect(wrapper.find('.client-info-chips').exists()).toBe(false);
  });
});
