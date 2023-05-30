import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import now from '@webitel/cc-ui-sdk/src/store/modules/now/reactive-now';
import QueuePreviewTimer from '../queue-preview-timer.vue';

const store = createStore({ modules: { now } });
const task = { createdAt: Date.now() };

describe('QueuePreviewTimer', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(QueuePreviewTimer, {
      global: { plugins: [store] },
      props: { task },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
