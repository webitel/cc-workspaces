import { shallowMount } from '@vue/test-utils';
import EmptySearch from '../../../../../../src/ui/modules/work-section/modules/shared/components/workspace-empty-search/empty-search.vue';

describe('EmptySearch', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(EmptySearch, {
      propsData: {
        type: 'history',
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
