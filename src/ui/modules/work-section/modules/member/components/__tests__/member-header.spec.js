import { shallowMount } from '@vue/test-utils';
import { vi } from 'vitest';
import { createStore } from 'vuex';

import MemberHeader from '../member-header.vue';

const buildStore = ({ isCommSelected = false } = {}) =>
	createStore({
		modules: {
			features: {
				namespaced: true,
				modules: {
					member: {
						namespaced: true,
						getters: {
							MEMBER_ON_WORKSPACE: () => ({
								name: 'John',
							}),
							IS_COMMUNICATION_SELECTED: () => isCommSelected,
						},
						actions: {
							CALL: vi.fn(),
						},
					},
				},
			},
		},
	});

describe('Member header', () => {
	it('renders component', () => {
		const wrapper = shallowMount(MemberHeader, {
			global: {
				plugins: [
					buildStore(),
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
	});
});
