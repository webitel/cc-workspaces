import { shallowMount } from '@vue/test-utils';

import OfflinePreview from '../offline-queue-preview.vue';

describe('Other UIs', () => {
	let member;
	const name = 'jest';

	beforeEach(() => {
		member = {
			name,
			communications: [
				{
					destination: '123',
				},
				{
					destination: '456',
				},
			],
		};
	});

	it('computes display name and queue name from task', () => {
		const wrapper = shallowMount(OfflinePreview, {
			props: {
				task: {
					...member,
					queue: {
						name: 'Support',
					},
				},
			},
		});
		expect(wrapper.vm.displayName).toBe(name);
		expect(wrapper.vm.displayQueueName).toBe('Support');
	});
});
