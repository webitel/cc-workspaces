import { shallowMount } from '@vue/test-utils';
import deepmerge from 'deepmerge';
import FailureForm
  from '../reporting-failure-form.vue';
import TheReporting
  from '../the-reporting.vue';
import ReportingForm
  from '../../store/ReportingForm';

const mockReporingForm = jest.fn();
const taskOnWorkspace = {
  allowReporting: true,
  reporting: mockReporingForm,
  task: { reportedAt: 0 },
};
let reporting = new ReportingForm(taskOnWorkspace);
taskOnWorkspace.postProcessData = reporting;

const props = {
  task: taskOnWorkspace,
};

const computed = {
  isTaskReporting: () => true,
  taskPostProcessing() { return reporting; },
  reportingSent: () => false,
};

const options = {
  props,
  computed,
};

const initReportingFormMock = jest.fn();
jest.spyOn(TheReporting.methods, 'initReportingForm')
    .mockImplementation(initReportingFormMock);

describe('TheReport appearance and form setting', () => {
  beforeEach(() => {
    initReportingFormMock.mockClear();
  });

  it('post processing immediately calls initReportingForm', () => {
    shallowMount(TheReporting, options);
    expect(initReportingFormMock).toHaveBeenCalled();
  });

  // https://github.com/vuejs/vue-test-utils/issues/331#issuecomment-382037200
  // it('post processing calls initReportingForm after isTaskReporingForm getter change', async () => {});

  it('should render report button color "secondary"', () => {
    const wrapper = shallowMount(TheReporting, deepmerge(
      options,
      {
        computed: {
          reportingSent() {
            return 1;
          },
        },
      },
    ));
    const { reportButtonColor } = wrapper.vm;
    expect(reportButtonColor).toBe('secondary');
  });

  it('should render report button text "Edit"', () => {
    const wrapper = shallowMount(TheReporting, deepmerge(
      options,
      {
        computed: {
          reportingSent() {
            return 1;
          },
        },
      },
    ));
    const { reportButtonText } = wrapper.vm;
    expect(reportButtonText).toBe('reusable.edit');
  });

  it('should render report button color "primary"', () => {
    const wrapper = shallowMount(TheReporting, options);
    const { reportButtonColor } = wrapper.vm;
    expect(reportButtonColor).toBe('primary');
  });

  it('should render report button text "Send"', () => {
    const wrapper = shallowMount(TheReporting, options);
    const { reportButtonText } = wrapper.vm;
    expect(reportButtonText).toBe('reusable.send');
  });
});

describe('Post processing Success reporting', () => {
  beforeEach(() => {
    initReportingFormMock.mockClear();
  });

  it('At success submit, calls taskOnWorkspace sendReport() method', () => {
    const sendReportMock = jest.spyOn(TheReporting.methods, 'sendReporting')
                               .mockImplementation(() => {
                               });
    const wrapper = shallowMount(TheReporting, options);
    wrapper.findAllComponents({ name: 'wt-button' }).at(-1).vm.$emit('click');
    expect(sendReportMock).toHaveBeenCalled();
  });
});

describe('Post processing Failure reporting', () => {
  afterEach(() => {
    reporting = new ReportingForm(taskOnWorkspace);
  });

  it('post processing failure form is initially invisible', async () => {
    const wrapper = shallowMount(TheReporting, options);
    const failureForm = wrapper.findComponent(FailureForm);
    expect(failureForm.isVisible()).toBe(false);
  });

  it('post processing failure form is shown if reporting.success is falsy', async () => {
    reporting.success = false;
    const wrapper = shallowMount(TheReporting, options);
    await wrapper.vm.$nextTick(); // re-render
    const failureForm = wrapper.findComponent(FailureForm);
    expect(failureForm.exists()).toBe(true);
  });
});
