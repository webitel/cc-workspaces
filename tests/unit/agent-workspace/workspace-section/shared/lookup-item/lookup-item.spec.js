import { shallowMount } from '@vue/test-utils';
import LookupItem from '../../../../../../src/ui/modules/work-section/modules/shared/components/lookup-item/lookup-item.vue';

describe('LookupItem', () => {
  const item = {};

  it('renders a component', () => {
    const wrapper = shallowMount(LookupItem, {
      propsData: { item },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
