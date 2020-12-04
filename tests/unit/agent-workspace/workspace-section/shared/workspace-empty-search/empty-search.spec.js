import { shallowMount } from '@vue/test-utils';
import EmptySearch from '../../../../../../src/components/agent-workspace/workspace-section/shared/workspace-empty-search/empty-search.vue';

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
