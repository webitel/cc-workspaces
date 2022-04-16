import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import FailureForm from '../../../../../../../src/ui/modules/info-section/modules/client-info/components/post-processing/post-processing-failure-form.vue';
import postProcessingModule from '../../../../../../../src/features/post-processing/store/post-processing';
import Reporting from '../../../../../../../src/features/post-processing/store/Reporting';

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
