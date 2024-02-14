import { shallowMount } from '@vue/test-utils';
import store from '../../../../../../../app/store';
import CallQueue from '../the-agent-call-queue.vue';

describe('CallQueue', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(CallQueue, {
      computed,
      global: {
        plugins: [store],
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
