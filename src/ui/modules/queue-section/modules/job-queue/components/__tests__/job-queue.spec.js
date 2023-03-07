import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import job from '../../../../../../../features/modules/job/store/job';
import JobQueue from '../the-agent-job-queue.vue';

const store = createStore({
                               modules: {
                                 features: {
                                   namespaced: true,
                                   modules: { job },
                                 },
                               },
                             });

describe('JobQueue', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(JobQueue, {
      global: { plugins: [store] },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
