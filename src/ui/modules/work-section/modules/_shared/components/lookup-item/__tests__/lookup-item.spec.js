import { shallowMount } from '@vue/test-utils';
import LookupItem from '../lookup-item.vue';

let callOnWorkspace;

const computed = {
  call: () => callOnWorkspace,
};
describe('LookupItem', () => {
  beforeEach(() => {
    callOnWorkspace = {
      historyId: '',
    };
  });
  const item = {};
  it('renders a component', () => {
    const wrapper = shallowMount(LookupItem, {
      propsData: { item },
      computed,
    });
    expect(wrapper.exists()).toBe(true);
  });
});
