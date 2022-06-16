import { shallowMount } from '@vue/test-utils';
import TaskHeader from '../task-header.vue';

describe('TaskHeader', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(TaskHeader);
    expect(wrapper.isVisible()).toBe(true);
  });
});
