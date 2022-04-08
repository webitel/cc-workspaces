import { shallowMount } from '@vue/test-utils';
import MergeLookupItem
  from '../../../../../../src/components/agent-workspace/workspace-section/shared/lookup-item/merge-lookup-item.vue';

describe('MergeLookupItem', () => {
  const item = {};
  const computed = {
    now() {
      return 0;
    },
  };

  it('renders a component', () => {
    const wrapper = shallowMount(MergeLookupItem, {
      propsData: { item },
      computed,
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('emits input event at wt-rounded-action click', () => {
    const wrapper = shallowMount(MergeLookupItem, {
      propsData: { item },
      computed,
    });
    wrapper.findComponent({ name: 'wt-rounded-action' }).vm.$emit('click');
    expect(wrapper.emitted().input[0]).toEqual([item]);
  });
});
