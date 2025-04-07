import { shallowMount } from '@vue/test-utils';

import ReportingForm from '../../store/ReportingForm';
import FailureForm from '../reporting-failure-form.vue';

const mockReportingForm = vi.fn();
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
