import { shallowMount } from '@vue/test-utils';
import SuccessForm from '../post-processing-success-form.vue';
import Reporting from '../../../../../../../../features/modules/reporting/store/Reporting';

const mockReporting = jest.fn();
const callOnWorkspace = {
  reporting: mockReporting,
};
callOnWorkspace.postProcessData = new Reporting(callOnWorkspace);

describe('Post processing Success form', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(SuccessForm, {
      computed: {
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
