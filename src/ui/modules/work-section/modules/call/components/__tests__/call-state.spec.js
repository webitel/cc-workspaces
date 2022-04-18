import { shallowMount } from '@vue/test-utils';
import { CallActions } from 'webitel-sdk';
import CallState
  from '../call-state.vue';

const call = {
  state: CallActions.Active,
};

describe('Call state', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(CallState, {
      computed: {
        call() {
          return call;
        },
        now() {
          return Date.now();
        },
        computeDTMFDigits() {
          return '';
        },
      },
    });
    expect(wrapper.isVisible()).toBe(true);
  });
});
