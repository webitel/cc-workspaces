import { shallowMount } from '@vue/test-utils';

import TaskContainer from '../task-container.vue';

describe('TaskContainer', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(TaskContainer);
    expect(wrapper.isVisible()).toBe(true);
  });
});
