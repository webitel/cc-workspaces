import { shallowMount } from '@vue/test-utils';
import ReactiveNowStoreModule
  from '@webitel/ui-sdk/src/store/ReactiveNowStoreModule/ReactiveNowStoreModule';
import { createStore } from 'vuex';

import QueuePreviewTimer from '../queue-preview-timer.vue';

const store = createStore({ modules: { now: new ReactiveNowStoreModule().getModule() } });
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
