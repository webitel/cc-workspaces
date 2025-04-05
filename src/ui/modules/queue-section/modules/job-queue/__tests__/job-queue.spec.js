import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import job from '../../../../../../features/modules/job/store/job.js';
import JobQueue from '../the-agent-job-queue.vue';

describe('JobQueue', () => {
  let store;

  beforeEach(() => {
    store = createStore({
      modules: {
        features: {
          namespaced: true,
          modules: { job },
        },
      },
    });
  });

  it('renders a component', () => {
    const wrapper = shallowMount(JobQueue, {
      global: { plugins: [store] },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('show counter badges on md size', async () => {
    const wrapper = mount(JobQueue, {
      shallow: true,
      global: {
        plugins: [store],
        stubs: {
          WtExpansionPanel: false,
          WtExpandTransition: true,
        },
      },
    });
    store.state.features.job.jobList = [{}, {}];
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ name: 'WtChip' })).toBeTruthy();
  });

  it('hides counter badges on sm size', async () => {
    const wrapper = mount(JobQueue, {
      shallow: true,
      global: {
        plugins: [store],
        stubs: {
          WtExpansionPanel: false,
          WtExpandTransition: true,
        },
      },
    });
    store.state.features.job.jobList = [{}, {}];
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ name: 'WtChip' })).toBeTruthy();
  });
});
