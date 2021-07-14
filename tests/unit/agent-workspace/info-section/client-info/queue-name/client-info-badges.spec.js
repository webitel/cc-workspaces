import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import ClientInfoBadges
  from '../../../../../../src/components/agent-workspace/info-section/client-info/queue-name/client-info-badges.vue';

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

describe('client-info-badges.vue', () => {
  beforeEach(() => {
    task.task = {};
  });
  it('Should render component', () => {
    const wrapper = shallowMount(ClientInfoBadges, {
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
    const wrapper = shallowMount(ClientInfoBadges, {
      localVue,
      store,
    });
    expect(wrapper.findComponent({ name: 'wt-badge' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'wt-badge' }).text()).toBe(display);
  });
  it('if task has no queue, queue badge is absent', () => {
    const wrapper = shallowMount(ClientInfoBadges, {
      localVue,
      store,
    });
    expect(wrapper.find('.client-info-badges').exists()).toBe(false);
  });
});
