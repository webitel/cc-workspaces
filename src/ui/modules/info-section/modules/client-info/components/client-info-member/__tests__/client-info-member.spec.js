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
	it('does not render variable items when task variables are empty', () => {
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

	it('maps task variables to computed variables list', () => {
		const store = buildStore({
			variables: {
				crmId: '42',
				tier: 'gold',
			},
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
		expect(wrapper.vm.variables).toHaveLength(2);
		expect(wrapper.vm.variables.map((v) => v.key)).toEqual([
			'crmId',
			'tier',
		]);
	});
});
