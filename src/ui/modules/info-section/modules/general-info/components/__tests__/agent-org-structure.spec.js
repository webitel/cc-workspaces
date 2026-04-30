import { mount, shallowMount } from '@vue/test-utils';

import AgentOrgStructure from '../agent-org-structure.vue';

describe('General Info: Agent Org Structure', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(AgentOrgStructure, {
			props: {
				agent: {},
			},
		});
		expect(wrapper.exists()).toBe(true);
	});
	it('correctly renders agent supervisors', () => {
		const sup1 = 'sup1';
		const sup2 = 'sup2';
		const supervisor = [
			{
				name: sup1,
			},
			{
				name: sup2,
			},
		];
		const wrapper = shallowMount(AgentOrgStructure, {
			props: {
				agent: {
					supervisor,
				},
			},
		});
		expect(wrapper.vm.supervisors).toEqual([
			sup1,
			sup2,
		]);
	});
	it('correctly renders agent auditors', () => {
		const aud1 = 'aud1';
		const aud2 = 'aud2';
		const auditor = [
			{
				name: aud1,
			},
			{
				name: aud2,
			},
		];
		const wrapper = shallowMount(AgentOrgStructure, {
			props: {
				agent: {
					auditor,
				},
			},
		});
		expect(wrapper.vm.auditors).toEqual([
			aud1,
			aud2,
		]);
	});
});
