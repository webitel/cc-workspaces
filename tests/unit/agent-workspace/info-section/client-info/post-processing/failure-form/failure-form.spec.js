import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import FailureForm from '../../../../../../../src/components/agent-workspace/info-section/client-info/post-processing/post-processing-failure-form.vue';
import postProcessingModule from '../../../../../../../src/store/modules/post-processing/post-processing';
import Reporting from '../../../../../../../src/store/modules/post-processing/Reporting';

const localVue = createLocalVue();
localVue.use(Vuex);

const mockReporting = jest.fn();
const callOnWorkspace = {
  reporting: mockReporting,
};
callOnWorkspace.postProcessData = new Reporting(callOnWorkspace);

describe('Post processing Failure form', () => {
  let state;
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      state,
      modules: {
        reporting: postProcessingModule,
        workspace: {
          namespaced: true,
          getters: {
            TASK_ON_WORKSPACE: () => callOnWorkspace,
          },
        },
      },
    });
  });

  it('renders a component', () => {
    const wrapper = shallowMount(FailureForm, { store, localVue });
    expect(wrapper.exists()).toBe(true);
  });
});
