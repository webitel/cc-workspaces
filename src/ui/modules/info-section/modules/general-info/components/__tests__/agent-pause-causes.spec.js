import { shallowMount } from '@vue/test-utils';

import AgentPauseCauses from '../agent-pause-causes.vue';

describe('General Info: Agent Pause Causes', () => {
	it('renders pause causes wrapper with passed size modifier', () => {
		const wrapper = shallowMount(AgentPauseCauses, {
			props: {
				pauseCauses: [],
				size: 'sm',
			},
		});
		expect(wrapper.exists()).toBe(true);
		expect(wrapper.find('.agent-pause-causes').exists()).toBe(true);
		expect(wrapper.classes()).toContain('agent-pause-causes--sm');
	});
});
