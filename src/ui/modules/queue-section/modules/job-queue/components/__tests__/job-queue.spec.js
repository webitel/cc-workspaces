import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import job from '../../../../../../../features/modules/job/store/job';
import JobQueue from '../the-agent-job-queue.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({
                               modules: {
                                 features: {
                                   namespaced: true,
                                   modules: { job },
                                 },
                               },
                             });

describe('JobQueue', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(JobQueue, { localVue, store });
    expect(wrapper.exists()).toBe(true);
  });
});
