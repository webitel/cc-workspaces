import { shallowMount } from '@vue/test-utils';
import MissedQueuePreview
  from '@/ui/modules/queue-section/modules/call-queue/components/missed-queue/missed-queue-preview.vue';

describe('MissedQueuePreview', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(MissedQueuePreview, {
      propsData: {
        index: 1,
        call: {},
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
