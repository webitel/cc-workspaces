import { shallowMount } from '@vue/test-utils';
import ContactLookupItem from '../../../../../../src/components/agent-workspace/workspace-section/shared/lookup-item/contact-lookup-item.vue';

describe('ContactLookupItem', () => {
  const item = {};

  it('renders a component', () => {
    const wrapper = shallowMount(ContactLookupItem, {
      propsData: { item },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('emits input event at wt-rounded-action click', () => {
    const wrapper = shallowMount(ContactLookupItem, {
      propsData: { item },
    });
    wrapper.findComponent({ name: 'wt-rounded-action' }).vm.$emit('click');
    expect(wrapper.emitted().input[0]).toEqual([item]);
  });
});
