import { shallowMount } from '@vue/test-utils';

import AgentQueues from '../agent-queues.vue';

describe('General Info: Agent Queues', () => {
	it('renders queue name and members limit badge', () => {
		const queues = [
			{
				queue: {
					id: 'q1',
					name: 'Support',
				},
				waitingMembers: 15,
				maxMemberLimit: 10,
				agents: [],
			},
		];
		const wrapper = shallowMount(AgentQueues, {
			props: {
				queues,
			},
		});
		expect(wrapper.exists()).toBe(true);
		expect(wrapper.vm.displayMembers(queues[0])).toBe('10+');
	});
});
