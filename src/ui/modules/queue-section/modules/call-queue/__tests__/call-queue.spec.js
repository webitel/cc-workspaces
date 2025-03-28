import { shallowMount } from '@vue/test-utils';
import store from '../../../../../../app/store/index.js';
import CallQueue from '../the-agent-call-queue.vue';

describe('CallQueue', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(CallQueue, {
      global: {
        plugins: [store],
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
