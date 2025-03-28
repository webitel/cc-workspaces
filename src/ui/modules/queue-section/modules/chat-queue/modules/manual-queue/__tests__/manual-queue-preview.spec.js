import { shallowMount } from '@vue/test-utils';
import ManualQueuePreview from '../manual-queue-preview.vue';

describe('Chats: ManualQueuePreview', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(ManualQueuePreview, {
      props: {
        task: {
          queue: {},
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
