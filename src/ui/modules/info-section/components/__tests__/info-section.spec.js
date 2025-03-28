import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { CallActions } from 'webitel-sdk';

import WorkspaceStates from '../../../../enums/WorkspaceState.enum.js';
import InfoSectionModule from '../../store/infoSec.js';
import InfoSection
  from '../the-agent-info-section.vue';

const callOnWorkspace = { state: CallActions.Active, allowReporting: true };

describe('InfoSection', () => {
  let store;
  store = createStore({
    modules: {
      ...InfoSectionModule,
    },
  });
  it('renders a component', () => {
    const wrapper = shallowMount(InfoSection, {
      global: { plugins: [store] },
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
