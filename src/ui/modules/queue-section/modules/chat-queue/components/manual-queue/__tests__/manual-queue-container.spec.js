import { shallowMount } from '@vue/test-utils';
import ManualQueueContainer from '../manual-queue-container.vue';
import store from '../../../../../../../../app/store';

describe('Chats: ManualQueueContainer', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(ManualQueueContainer, {
      global: {
        plugins: [store],
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
