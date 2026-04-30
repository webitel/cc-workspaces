import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';

import ClientInfoMember from '../client-info-member.vue';

const buildStore = (taskOnWorkspace) =>
	createStore({
		modules: {
			workspace: {
				namespaced: true,
				getters: {
					TASK_ON_WORKSPACE: () => taskOnWorkspace,
				},
			},
		},
	});

describe('Client Info Member from Call', () => {
	it('Correctly renders empty variables', () => {
		const store = buildStore({
			variables: {},
			task: {
				communication: {},
			},
		});
		const wrapper = mount(ClientInfoMember, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.find('.client-info-member-item').exists()).toBe(false);
	});

	it('Correctly renders member description', () => {
		const store = buildStore({
			variables: {},
			task: {
				communication: {
					description: 'description',
				},
			},
		});
		const wrapper = mount(ClientInfoMember, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.vm.memberDescription).toBe('description');
	});
});
