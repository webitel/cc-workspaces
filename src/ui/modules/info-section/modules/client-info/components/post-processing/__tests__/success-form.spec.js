import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import SuccessForm from '../post-processing-success-form.vue';
import postProcessingModule from '../../../../../../../../features/reporting/store/post-processing';
import Reporting from '../../../../../../../../features/reporting/store/Reporting';

const localVue = createLocalVue();
localVue.use(Vuex);

const mockReporting = jest.fn();
const callOnWorkspace = {
  reporting: mockReporting,
};
callOnWorkspace.postProcessData = new Reporting(callOnWorkspace);

describe('Post processing Success form', () => {
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
    const wrapper = shallowMount(SuccessForm, { store, localVue });
    expect(wrapper.exists()).toBe(true);
  });
});
