import { shallowMount } from '@vue/test-utils';
import ProcessingTab from '../processing-tab.vue';

describe('ProcessingTab', () => {
  const task = { attempt: {} };

  const propsData = {
    task,
  };

  it('renders a component', () => {
    const wrapper = shallowMount(ProcessingTab, {
      propsData,
    });
    expect(wrapper.isVisible()).toBe(true);
  });
});
