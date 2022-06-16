import { shallowMount } from '@vue/test-utils';
import MissedQueuePreview
  from '../missed-queue-preview.vue';

describe('MissedQueuePreview', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(MissedQueuePreview, {
      propsData: {
        index: 1,
        task: {},
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
