import { mount, shallowMount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { vi } from 'vitest';
import { createStore } from 'vuex';

import ContactsContainer from '../contacts-container.vue';

describe('ContactsContainer', () => {
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
		const wrapper = shallowMount(ContactsContainer, {
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
