import { shallowMount } from '@vue/test-utils';
import CallStatusIconChip from '@/components/agent-workspace/queue-section/call-queue/call-status-icon-chip.vue';

describe('CallStatusIconChip', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(CallStatusIconChip, {
      stubs: { Icon: true },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
