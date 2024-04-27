import { shallowMount } from '@vue/test-utils';
import { CallActions } from 'webitel-sdk';
import InfoSection
  from '../the-agent-info-section.vue';

const callOnWorkspace = { state: CallActions.Active, allowReporting: true };

describe('InfoSection', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(InfoSection, {
      computed: {
        ...InfoSection.computed,
        showProcessing: () => true,
        showFlows: () => true,
        taskOnWorkspace: () => callOnWorkspace,
      },
    });
    expect(wrapper.isVisible()).toBe(true);
  });
});
