import { shallowMount } from '@vue/test-utils';
import ConfigurationAPI from '@webitel/ui-sdk/src/api/clients/configurations/configurations';
import { createPinia } from 'pinia';
import { vi } from 'vitest';
import { createStore } from 'vuex';

import ClientInfo from '../client-info-tab.vue';

vi.mock('../../../../userinfo/userinfoStore', () => ({
	useUserinfoStore: () => ({
		hasLicense: () => true,
	}),
}));

describe('Client Info Tab', () => {
	const buildStore = ({ isJob = false, isChatClosed = false } = {}) =>
		createStore({
			getters: {
				'workspace/IS_JOB_WORKSPACE': () => isJob,
				'features/chat/closed/IS_CHAT_ON_WORKSPACE_CLOSED': () => isChatClosed,
			},
		});

	it('always renders client-info chips', async () => {
		vi.spyOn(ConfigurationAPI, 'getList').mockResolvedValue({
			items: [],
		});
		const store = buildStore();
		const wrapper = shallowMount(ClientInfo, {
			props: {
				task: {},
				size: 'md',
			},
			global: {
				plugins: [
					store,
					createPinia(),
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
		expect(
			wrapper
				.findComponent({
					name: 'client-info-chips',
				})
				.exists(),
		).toBe(true);
	});

	it('hides contact block in job workspace', async () => {
		vi.spyOn(ConfigurationAPI, 'getList').mockResolvedValue({
			items: [],
		});
		const store = buildStore({
			isJob: true,
		});
		const wrapper = shallowMount(ClientInfo, {
			props: {
				task: {},
				size: 'md',
			},
			global: {
				plugins: [
					store,
					createPinia(),
				],
			},
		});
		await Promise.resolve();
		expect(wrapper.find('contact').exists()).toBe(false);
	});

	it('hides contact block when hideContact flag provided by task', async () => {
		vi.spyOn(ConfigurationAPI, 'getList').mockResolvedValue({
			items: [],
		});
		const store = buildStore();
		const wrapper = shallowMount(ClientInfo, {
			props: {
				task: {
					hideContact: true,
				},
				size: 'md',
			},
			global: {
				plugins: [
					store,
					createPinia(),
				],
			},
		});
		await Promise.resolve();
		expect(wrapper.find('contact').exists()).toBe(false);
	});
});
