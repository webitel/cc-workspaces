import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import SuccessForm from '../../../../../../src/components/agent-workspace/info-section/post-processing/post-processing-success-form.vue';
import postProcessingModule from '../../../../../../src/store/modules/post-processing/post-processing';

const localVue = createLocalVue();
localVue.use(Vuex);

const mockReporting = jest.fn();
const callOnWorkspace = {
  reporting: mockReporting,
};

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
