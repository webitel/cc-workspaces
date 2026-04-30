import { mount, shallowMount } from '@vue/test-utils';
import { CallActions, CallDirection } from 'webitel-sdk';
import { createStore } from 'vuex';

import ActivePreview from '../active-queue-preview.vue';

const buildStore = (task) =>
	createStore({
		state: {
			ui: {
				now: {
					now: Date.now(),
				},
			},
		},
		modules: {
			features: {
				namespaced: true,
				modules: {
					call: {
						namespaced: true,
						getters: {
							CALL_ON_WORKSPACE: () => task,
							GET_CURRENT_CALL_DIGITS: () => '',
							NORMALIZE_PHONE_NUMBER: () => (value) => value,
						},
					},
				},
			},
		},
	});

describe('Other UIs', () => {
	let task;
	const display = 'jest';

	beforeEach(() => {
		task = {
			displayName: display,
			displayNumber: display,
			isHold: true,
			state: CallActions.Ringing,
			direction: CallDirection.Inbound,
		};
	});

	it('does not render queue chips when task queue is missing', () => {
		task.task = {};
		const wrapper = shallowMount(ActivePreview, {
			props: {
				task,
			},
			global: {
				plugins: [
					buildStore(task),
				],
			},
		});
		expect(wrapper.find('.queue-preview-chips').exists()).toBe(false);
		expect(wrapper.vm.queueName).toBeUndefined();
	});
});

describe('Preview Actions', () => {
	let task;

	beforeEach(() => {
		task = {
			state: CallActions.Ringing,
			direction: CallDirection.Inbound,
			isHold: false,
		};
	});

	it('shows preview actions on inbound ringing call', () => {
		const wrapper = mount(ActivePreview, {
			props: {
				task,
				size: 'md',
			},
			shallow: true,
			global: {
				plugins: [
					buildStore(task),
				],
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
		expect(wrapper.vm.isRinging).toBe(true);
	});

	it('shows preview actions on outbound preview dialer call', () => {
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
				plugins: [
					buildStore(task),
				],
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
		expect(wrapper.vm.isRinging).toBe(true);
	});

	it('hides preview actions on outbound non-preview calls', () => {
		task = {
			direction: CallDirection.Outbound,
			isHold: false,
		};
		const wrapper = shallowMount(ActivePreview, {
			props: {
				task,
			},
			global: {
				plugins: [
					buildStore(task),
				],
			},
		});
		expect(wrapper.find('.preview-actions').exists()).toBeFalsy();
	});
});
