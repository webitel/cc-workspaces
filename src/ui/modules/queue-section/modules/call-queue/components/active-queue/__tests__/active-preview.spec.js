import { mount, shallowMount } from '@vue/test-utils';
import { CallActions, CallDirection } from 'webitel-sdk';

import ActivePreview from '../active-queue-preview.vue';

describe('Other UIs', () => {
	let task;
	const display = 'jest';

	beforeEach(() => {
		task = {
			displayName: display,
			displayNumber: display,
			isHold: true,
		};
	});

	it('if call has no queue, queue chip is absent', () => {
		task.task = {};
		const wrapper = shallowMount(ActivePreview, {
			props: {
				task,
			},
		});
		expect(wrapper.find('.queue-preview-chips').exists()).toBe(false);
	});
});

describe('Preview Actions', () => {
	let task;

	beforeEach(() => {
		task = {
			state: CallActions.Ringing,
			direction: CallDirection.Inbound,
		};
	});

	it('Shows preview actions on Inbound Ringing', () => {
		const wrapper = mount(ActivePreview, {
			props: {
				task,
				size: 'md',
			},
			shallow: true,
			global: {
				stubs: {
					TaskQueuePreview: false,
					WtButton: false,
				},
			},
		});
		expect(
			wrapper
				.findComponent({
					name: 'wt-button',
				})
				.exists(),
		).toBeTruthy();
	});

	it('Shows preview actions on Preview Dialer', () => {
		task = {
			state: CallActions.Ringing,
			direction: CallDirection.Outbound,
			queue: {
				queue_type: 'preview',
			},
		};
		const wrapper = mount(ActivePreview, {
			props: {
				task,
				size: 'md',
			},
			shallow: true,
			global: {
				stubs: {
					TaskQueuePreview: false,
					WtButton: false,
				},
			},
		});
		expect(
			wrapper
				.findComponent({
					name: 'wt-button',
				})
				.exists(),
		).toBeTruthy();
	});

	it('Hides preview actions on Outbound calls', () => {
		task = {
			direction: CallDirection.Outbound,
		};
		const wrapper = shallowMount(ActivePreview, {
			props: {
				task,
			},
		});
		expect(wrapper.find('.preview-actions').exists()).toBeFalsy();
	});
});
