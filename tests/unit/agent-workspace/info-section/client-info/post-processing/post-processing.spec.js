import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import FailureForm
  from '../../../../../../src/components/agent-workspace/info-section/client-info/post-processing/post-processing-failure-form.vue';
import SuccessForm
  from '../../../../../../src/components/agent-workspace/info-section/client-info/post-processing/post-processing-success-form.vue';
import PostProcessingTab
  from '../../../../../../src/components/agent-workspace/info-section/client-info/post-processing/post-processing.vue';
import postProcessingModule
  from '../../../../../../src/store/modules/post-processing/post-processing';
import Reporting
  from '../../../../../../src/store/modules/post-processing/Reporting';

const localVue = createLocalVue();
localVue.use(Vuex);

const mockReporting = jest.fn();
const callOnWorkspace = {
  hasReporting: true,
  reporting: mockReporting,
};
callOnWorkspace.postProcessData = new Reporting(callOnWorkspace);

describe('Post processing appearance and form setting', () => {
  let state;
  let store;
  const initReportingFormMock = jest.fn();

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

    initReportingFormMock.mockClear();
    jest.spyOn(PostProcessingTab.methods, 'initReportingForm')
        .mockImplementationOnce(initReportingFormMock);
  });

  it('post processing immediately calls initReportingForm', () => {
    shallowMount(PostProcessingTab, { store, localVue });
    expect(initReportingFormMock).toHaveBeenCalled();
  });

  // https://github.com/vuejs/vue-test-utils/issues/331#issuecomment-382037200
  // it('post processing calls initReportingForm after isTaskReporting getter change', async () => {});
});

describe('Post processing Success reporting', () => {
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

  it('post processing success form is initially visible', async () => {
    const wrapper = shallowMount(PostProcessingTab, { store, localVue });
    const successForm = wrapper.findComponent(SuccessForm);
    expect(successForm.isVisible()).toBe(true);
  });

  it('At success submit, calls taskOnWorkspace sendReport() method', () => {
    const sendReportMock = jest.spyOn(PostProcessingTab.methods, 'sendReporting')
                               .mockImplementation(() => {
                               });
    const wrapper = shallowMount(PostProcessingTab, { store, localVue });
    wrapper.findAllComponents({ name: 'wt-button' }).at(-1).vm.$emit('click');
    expect(sendReportMock).toHaveBeenCalled();
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
                               workspace: {
                                 namespaced: true,
                                 getters: {
                                   TASK_ON_WORKSPACE: () => callOnWorkspace,
                                 },
                               },
                             },
                           });
  });

  it('post processing failure form is initially invisible', async () => {
    const wrapper = shallowMount(PostProcessingTab, { store, localVue });
    const failureForm = wrapper.findComponent(FailureForm);
    expect(failureForm.isVisible()).toBe(false);
  });

  it('Opens failure form on radio click', async () => {
    const wrapper = shallowMount(PostProcessingTab, { store, localVue });
    wrapper.findAllComponents({ name: 'wt-button' })
           .wrappers.find((button) => button.attributes().color === 'danger')
           .vm.$emit('click');
    await wrapper.vm.$nextTick(); // re-render
    const failureForm = wrapper.findComponent(FailureForm);
    expect(failureForm.isVisible()).toBe(true);
  });
});
