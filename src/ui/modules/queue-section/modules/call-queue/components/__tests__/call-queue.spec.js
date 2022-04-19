import { shallowMount } from '@vue/test-utils';
import CallQueue from '../the-agent-call-queue.vue';

const callList = [];
const membersList = [];

const computed = {
  callList: () => callList,
  membersList: () => membersList,
  isNewMissed: () => false,
};

describe('CallQueue', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(CallQueue, { computed });
    expect(wrapper.exists()).toBe(true);
  });
});
