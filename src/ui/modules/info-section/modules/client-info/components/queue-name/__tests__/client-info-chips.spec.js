import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import ClientInfoQueue from '../client-info-queue.vue';

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

describe('client-info-queue.vue', () => {
	beforeEach(() => {
		task.attempt = {};
	});
	it('renders component wrapper', () => {
		const wrapper = shallowMount(ClientInfoQueue, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('renders queue name text from task attempt queue', () => {
		const display = 'jest';
		task.attempt = {
			queue: {
				name: display,
			},
		};
		const wrapper = mount(ClientInfoQueue, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.find('.queue-name__text').exists()).toBe(true);
		expect(wrapper.find('.queue-name__text').text()).toBe(`Queue: ${display}`);
	});

	it('does not render queue text when task has no queue', () => {
		const wrapper = shallowMount(ClientInfoQueue, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.find('.client-info-queue').exists()).toBe(false);
	});

	it('does not render queue text when queue name is empty', () => {
		task.attempt = {
			queue: {
				name: '',
			},
		};
		const wrapper = shallowMount(ClientInfoQueue, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.find('.client-info-queue').exists()).toBe(false);
	});
});
