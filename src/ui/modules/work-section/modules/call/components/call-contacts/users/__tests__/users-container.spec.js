import { createPinia } from 'pinia';
import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { vi } from 'vitest';

import UsersContainer from '../users-container.vue';

describe('UsersContainer', () => {
	const callAction = vi.fn();
	const store = createStore({
		modules: {
			features: {
				namespaced: true,
				modules: {
					call: {
						namespaced: true,
						actions: {
							CALL: callAction,
						},
					},
				},
			},
		},
	});

	it('renders a component', () => {
		const wrapper = shallowMount(UsersContainer, {
			global: {
				plugins: [
					store,
					createPinia(),
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
	});
});
