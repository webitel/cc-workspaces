import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import SuccessForm
  from '../../../../../src/components/agent-workspace/info-section/post-processing/post-processing-success-form.vue';
import postProcessingModule from '../../../../../src/store/modules/post-processing/post-processing';

const localVue = createLocalVue();
localVue.use(Vuex);

const mockReporting = jest.fn();
const callOnWorkspace = {
  reporting: mockReporting,
};

describe('Post processing Success reporting', () => {
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

  it('Sends success report [WITHOUT CATEGORIES, FOR NOW]', () => {
    const wrapper = shallowMount(SuccessForm, {
      store,
      localVue,
      mocks: {
        $t: () => {
        },
      },
    });

    wrapper.find('.processing-form__submit').trigger('click');
    expect(mockReporting).toHaveBeenCalled();
  });
});
