import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import ClientInfoChips from '../client-info-chips.vue';

const task = {
	task: {},
};

const store = createStore({
	modules: {
		workspace: {
			namespaced: true,
			getters: {
				TASK_ON_WORKSPACE: () => task,
			},
		},
	},
});

describe('client-info-chips.vue', () => {
	beforeEach(() => {
		task.attempt = {};
	});
	it('renders component wrapper', () => {
		const wrapper = shallowMount(ClientInfoChips, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('renders queue name chip from task attempt queue', () => {
		const display = 'jest';
		task.attempt = {
			queue: {
				name: display,
			},
		};
		const wrapper = mount(ClientInfoChips, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(
			wrapper
				.findComponent({
					name: 'wt-chip',
				})
				.exists(),
		).toBe(true);
		expect(
			wrapper
				.findComponent({
					name: 'wt-chip',
				})
				.text(),
		).toBe(display);
	});

	it('does not render queue chip when task has no queue', () => {
		const wrapper = shallowMount(ClientInfoChips, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.find('.client-info-chips').exists()).toBe(false);
	});

	it('does not render queue chip when queue name is empty', () => {
		task.attempt = {
			queue: {
				name: '',
			},
		};
		const wrapper = shallowMount(ClientInfoChips, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.find('.client-info-chips').exists()).toBe(false);
	});
});
