import { shallowMount } from '@vue/test-utils';
import CallStatusIconChip from '../../../../../src/ui/modules/queue-section/modules/call-queue/components/call-status-icon-chip.vue';

describe('CallStatusIconChip', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(CallStatusIconChip, {
      stubs: { Icon: true },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
