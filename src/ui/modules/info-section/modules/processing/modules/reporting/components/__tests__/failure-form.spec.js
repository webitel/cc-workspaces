import { shallowMount } from '@vue/test-utils';
import FailureForm from '../reporting-failure-form.vue';
import ReportingForm from '../../store/ReportingForm';

const mockReportingForm = jest.fn();
const callOnWorkspace = {
  reporting: mockReportingForm,
};
callOnWorkspace.postProcessData = new ReportingForm(callOnWorkspace);

describe('Post processing Failure form', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(FailureForm, {
      computed: {
        isMember() {
          return true;
        },
        taskPostProcessing() {
          return callOnWorkspace.postProcessData;
        },
        taskOnWorkspace() {
          return callOnWorkspace;
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
