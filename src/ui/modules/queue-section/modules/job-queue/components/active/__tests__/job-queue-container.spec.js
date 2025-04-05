import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import job from '../../../../../../../../features/modules/job/store/job.js';
import JobQueueContainer from '../job-queue-container.vue';

const store = createStore({
                               modules: {
                                 features: {
                                   namespaced: true,
                                   modules: { job },
                                 },
                               },
                             });

describe('JobQueueContainer', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(JobQueueContainer, {
      global: { plugins: [store] },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
