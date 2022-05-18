import { shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import FailureForm
  from '../reporting-failure-form.vue';
import SuccessForm
  from '../reporting-success-form.vue';
import PostProcessingTab
  from '../the-reporting.vue';
import Reporting
  from '../../../../../../../../features/modules/reporting/store/Reporting';

const mockReporting = jest.fn();
const callOnWorkspace = {
  allowReporting: true,
  reporting: mockReporting,
  task: { reportedAt: 0 },
};
let reporting = new Reporting(callOnWorkspace);
callOnWorkspace.postProcessData = reporting;

const computed = {
  isTaskReporting: () => true,
  taskPostProcessing() { return reporting; },
  isCommunicationPopup: () => false,
  reportingSent: () => false,
};

const initReportingFormMock = jest.fn();
jest.spyOn(PostProcessingTab.methods, 'initReportingForm')
    .mockImplementation(initReportingFormMock);

describe('Post processing appearance and form setting', () => {
  beforeEach(() => {
    initReportingFormMock.mockClear();
  });

  it('post processing immediately calls initReportingForm', () => {
    shallowMount(PostProcessingTab, { computed });
    expect(initReportingFormMock).toHaveBeenCalled();
  });

  // https://github.com/vuejs/vue-test-utils/issues/331#issuecomment-382037200
  // it('post processing calls initReportingForm after isTaskReporting getter change', async () => {});

  it('should render report button color "secondary"', () => {
    const wrapper = shallowMount(PostProcessingTab, {
      computed: {
        ...computed,
        reportingSent() {
          return 1;
        },
      },
    });
    const { reportButtonColor } = wrapper.vm;
    expect(reportButtonColor).toBe('secondary');
  });

  it('should render report button text "Edit"', () => {
    const wrapper = shallowMount(PostProcessingTab, {
      computed: {
        ...computed,
        reportingSent() {
          return 1;
        },
      },
    });
    const { reportButtonText } = wrapper.vm;
    expect(reportButtonText).toBe('reusable.edit');
  });

  it('should render report button color "primary"', () => {
    const wrapper = shallowMount(PostProcessingTab, { computed });
    const { reportButtonColor } = wrapper.vm;
    expect(reportButtonColor).toBe('primary');
  });

  it('should render report button text "Send"', () => {
    const wrapper = shallowMount(PostProcessingTab, { computed });
    const { reportButtonText } = wrapper.vm;
    expect(reportButtonText).toBe('reusable.send');
  });
});

describe('Post processing Success reporting', () => {
  beforeEach(() => {
    initReportingFormMock.mockClear();
  });

  it('post processing success form is initially visible', () => {
    const wrapper = shallowMount(PostProcessingTab, { computed });
    const successForm = wrapper.findComponent(SuccessForm);
    expect(successForm.isVisible()).toBe(true);
  });

  it('At success submit, calls taskOnWorkspace sendReport() method', () => {
    const sendReportMock = jest.spyOn(PostProcessingTab.methods, 'sendReporting')
                               .mockImplementation(() => {
                               });
    const wrapper = shallowMount(PostProcessingTab, { computed });
    wrapper.findAllComponents({ name: 'wt-button' }).at(-1).vm.$emit('click');
    expect(sendReportMock).toHaveBeenCalled();
  });
});

describe('Post processing Failure reporting', () => {
  afterEach(() => {
    reporting = new Reporting(callOnWorkspace);
  });

  it('post processing failure form is initially invisible', async () => {
    const wrapper = shallowMount(PostProcessingTab, { computed });
    const failureForm = wrapper.findComponent(FailureForm);
    expect(failureForm.isVisible()).toBe(false);
  });

  it('post processing failure form is shown if reporting.success is falsy', async () => {
    reporting.success = false;
    const wrapper = shallowMount(PostProcessingTab, { computed });
    await wrapper.vm.$nextTick(); // re-render
    const failureForm = wrapper.findComponent(FailureForm);
    expect(failureForm.isVisible()).toBe(true);
  });
});
