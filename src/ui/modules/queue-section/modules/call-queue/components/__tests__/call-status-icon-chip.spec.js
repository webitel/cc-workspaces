import { shallowMount } from '@vue/test-utils';
import CallStatusIconChip from '../call-status-icon-chip.vue';

describe('CallStatusIconChip', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(CallStatusIconChip, {
      stubs: { Icon: true },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
