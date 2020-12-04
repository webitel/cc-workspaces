import { shallowMount } from '@vue/test-utils';
import CallStatusIconBadge from '../../../../src/components/agent-workspace/queue-section/call-status-icon-badge.vue';

describe('CallStatusIconBadge', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(CallStatusIconBadge, {
      stubs: { Icon: true },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
