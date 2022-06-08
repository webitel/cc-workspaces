import { shallowMount } from '@vue/test-utils';
import AgentOrgStructure from '../agent-org-structure.vue';

describe('General Info: Agent Org Structure', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(AgentOrgStructure, {
      propsData: {
        agent: {},
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
  it('correctly renders agent supervisors', () => {
    const sup1 = 'sup1';
    const sup2 = 'sup2';
    const supervisor = [{ name: sup1 }, { name: sup2 }];
    const wrapper = shallowMount(AgentOrgStructure, {
      propsData: { agent: { supervisor } },
    });
    const supervisorsUIWrappers = wrapper.findAll('.agent-org-structure__item--supervisors .agent-org-structure__item__value');
    expect(supervisorsUIWrappers.length).toBe(2);
    expect(supervisorsUIWrappers.at(0).text()).toBe(sup1);
    expect(supervisorsUIWrappers.at(1).text()).toBe(sup2);
  });
  it('correctly renders agent auditors', () => {
    const aud1 = 'aud1';
    const aud2 = 'aud2';
    const auditor = [{ name: aud1 }, { name: aud2 }];
    const wrapper = shallowMount(AgentOrgStructure, {
      propsData: { agent: { auditor } },
    });
    const auditorsUIWrappers = wrapper.findAll('.agent-org-structure__item--auditors .agent-org-structure__item__value');
    expect(auditorsUIWrappers.length).toBe(2);
    expect(auditorsUIWrappers.at(0).text()).toBe(aud1);
    expect(auditorsUIWrappers.at(1).text()).toBe(aud2);
  });
});
