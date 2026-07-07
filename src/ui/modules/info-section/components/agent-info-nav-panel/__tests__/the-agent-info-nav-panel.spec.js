import { shallowMount } from '@vue/test-utils';

import TheAgentInfoNavPanel from '../the-agent-info-nav-panel.vue';

describe('TheAgentInfoNavPanel', () => {
	it('renders a component', () => {
		const tabs = [
			{
				value: 'general-info',
				icon: 'general-info',
				text: 'General',
			},
			{
				value: 'client-info',
				icon: 'client-info',
				text: 'Client',
			},
		];
		const wrapper = shallowMount(TheAgentInfoNavPanel, {
			props: {
				tabs,
				currentTab: tabs[0],
			},
		});
		expect(wrapper.isVisible()).toBe(true);
		expect(
			wrapper.findAllComponents({
				name: 'wt-button',
			}),
		).toHaveLength(2);
		expect(
			wrapper
				.findAllComponents({
					name: 'wt-button',
				})[0]
				.props('variant'),
		).toBe('active');
	});
});
