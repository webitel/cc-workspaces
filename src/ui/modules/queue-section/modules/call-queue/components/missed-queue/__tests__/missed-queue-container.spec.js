import { shallowMount } from '@vue/test-utils';
import MissedQueueContainer
  from '../missed-queue-container.vue';

describe('MissedQueueContainer', () => {
  vi.spyOn(MissedQueueContainer.methods, 'loadMissedList').mockImplementation(() => {});
  vi.spyOn(MissedQueueContainer.methods, 'resetNewMissed').mockImplementation(() => {});

  it('renders a component', () => {
    const wrapper = shallowMount(MissedQueueContainer, {
      computed: {
        missedList: () => [{ id: 'jest' }],
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
