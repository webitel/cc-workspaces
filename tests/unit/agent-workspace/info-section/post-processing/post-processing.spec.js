import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import PostProcessingTab
  from '../../../../../src/components/agent-workspace/info-section/post-processing/post-processing-tab.vue';
import SuccessForm
  from '../../../../../src/components/agent-workspace/info-section/post-processing/post-processing-success-form.vue';
import FailureForm
  from '../../../../../src/components/agent-workspace/info-section/post-processing/post-processing-failure-form.vue';
import RadioButton from '../../../../../src/components/utils/radio-button.vue';
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

  it('Starts with success radio button', () => {
    const wrapper = shallowMount(PostProcessingTab, {
      store,
      localVue,
      mocks: {
        $t: () => {
        },
        $v: {
          $touch: jest.fn(),
          $pending: false,
          $error: false,
        },
      },
    });
    const yesRadio = wrapper.findAll(RadioButton)
      .wrappers.find((radioBtn) => radioBtn.props().option === true);
    expect(yesRadio.props().value === true).toBeTruthy();
  });

  it('Renders success form by default', () => {
    const wrapper = shallowMount(PostProcessingTab, {
      store,
      localVue,
      mocks: {
        $t: () => {
        },
        $v: {
          $touch: jest.fn(),
          $pending: false,
          $error: false,
        },
      },
    });
    expect(wrapper.find(SuccessForm).exists()).toBeTruthy();
  });

  it('Renders success form by default', () => {
    const wrapper = shallowMount(PostProcessingTab, {
      store,
      localVue,
      mocks: {
        $t: () => {
        },
        $v: {
          $touch: jest.fn(),
          $pending: false,
          $error: false,
        },
      },
    });

    wrapper.find('.post-processing__submit').trigger('click');
    expect(mockReporting).toHaveBeenCalled();
  });
});

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

  it('Opens failure form on radio click', async () => {
    const wrapper = shallowMount(PostProcessingTab, {
      store,
      localVue,
      mocks: {
        $t: () => {
        },
        $v: {
          $touch: jest.fn(),
          $pending: false,
          $error: false,
        },
      },
    });
    const noRadio = wrapper.findAll(RadioButton)
      .wrappers.find((radioBtn) => radioBtn.props().option === false);
    noRadio.vm.$emit('input', false);
    await wrapper.vm.$nextTick(); // re-render
    expect(wrapper.find(FailureForm).exists()).toBeTruthy();
  });
});
