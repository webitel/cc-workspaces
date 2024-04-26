import { mount, shallowMount } from '@vue/test-utils';
import FlowsTab
  from '../flows-tab.vue';
import AgentOrgStructure from '../../../general-info/components/agent-org-structure';

describe('FlowsTab', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(FlowsTab);
    expect(wrapper.exists()).toBe(true);
  });
  it('renders flows list', () => {
    const flows = [{ id: 1, name: 'flow1' }, { id: 2, name: 'flow2' }];
    const wrapper = mount(FlowsTab, {
      propsData: {
        flowsList: flows,
      }
    });
    const flowsItems = wrapper
      .findAll('.flow-item')
      .at(1);
    expect(flowsItems.length).toBe(2);
    expect(flowsItems.find('.flow-item__name').at(2).text()).toBe('flow1');
    expect(flowsItems.find('.flow-item__name').at(1).text()).toBe('flow2');
  });
});
