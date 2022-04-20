import { shallowMount } from '@vue/test-utils';
import FailureForm from '../post-processing-failure-form.vue';
import Reporting from '../../../../../../../../features/modules/reporting/store/Reporting';

const mockReporting = jest.fn();
const callOnWorkspace = {
  reporting: mockReporting,
};
callOnWorkspace.postProcessData = new Reporting(callOnWorkspace);

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
