import { shallowMount } from '@vue/test-utils';
import StatusSelect from '../agent-status-select.vue';

const lastStatusChange = Date.now() - 12 * 60 * 60 * 10 ** 3; // '12:00:00'

describe('Agent Status Select', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(StatusSelect, {
      computed: {
        now() {
          return Date.now();
        },
        agent() {
          return { lastStatusChange };
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  // it('correctly computes statusDuration', () => {
  //   agent.lastStatusChange = Date.now() - 24 * 1000;
  //   const wrapper = shallowMount(StatusSelect, { store, localVue });
  //   expect(wrapper.vm.statusDuration).toBe('00:00:23'); // 24 - 1
  // });
});
