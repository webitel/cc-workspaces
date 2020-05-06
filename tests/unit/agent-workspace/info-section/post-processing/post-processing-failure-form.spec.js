import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import FailureForm
  from '../../../../../src/components/agent-workspace/info-section/post-processing/post-processing-failure-form.vue';
import postProcessingModule from '../../../../../src/store/modules/post-processing/post-processing';

const localVue = createLocalVue();
localVue.use(Vuex);

const mockReporting = jest.fn();
const callOnWorkspace = {
  reporting: mockReporting,
};

describe('Post processing Failure reporting', () => {
  let state;
  let store;

  beforeEach(() => {
    state = {
      callOnWorkspace,
    };
    store = new Vuex.Store({
      state,
      modules: {
        reporting: postProcessingModule,
        call: {
          namespaced: true,
          state,
        },
      },
    });
  });

  it('Sends failure report [WITHOUT CATEGORIES, FOR NOW]', () => {
    const wrapper = shallowMount(FailureForm, {
      store,
      localVue,
      mocks: {
        $t: () => {
        },
      },
    });
    wrapper.find('.processing-form__submit').trigger('click');
    expect(mockReporting).toHaveBeenCalled();
    const nextDistributeAt = new Date(mockReporting.mock.calls[0][0].nextDistributeAt);
    // not nextDistribute === Date.now() because ms difference of execution time
    expect(nextDistributeAt.getMinutes()).toEqual(new Date().getMinutes());
  });
});
