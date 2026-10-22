import { flushPromises, shallowMount } from '@vue/test-utils';
import { ConfigurationsAPI } from '@webitel/api-services/api';
import { EngineSystemSettingName } from '@webitel/api-services/gen/models';
import { createPinia } from 'pinia';
import { vi } from 'vitest';
import { nextTick } from 'vue';
import { createStore } from 'vuex';

import { useSystemSettingsStore } from '../../../../../../../features/modules/system-settings/store/system-settings';
import Contact from '../../modules/contact/components/the-contact.vue';
import ClientInfo from '../client-info-tab.vue';

vi.mock('../../../../../userinfo/userinfoStore', () => ({
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

	it('always renders client-info queue', async () => {
		vi.spyOn(ConfigurationsAPI, 'getList').mockResolvedValue({
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
					name: 'client-info-queue',
				})
				.exists(),
		).toBe(true);
	});

	it('hides contact block in job workspace', async () => {
		vi.spyOn(ConfigurationsAPI, 'getList').mockResolvedValue({
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
		vi.spyOn(ConfigurationsAPI, 'getList').mockResolvedValue({
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

	it('hides already shown contact block when wbt_hide_contact system setting is turned on', async () => {
		vi.spyOn(ConfigurationsAPI, 'getList').mockResolvedValue({
			items: [],
		});
		const pinia = createPinia();
		const wrapper = shallowMount(ClientInfo, {
			props: {
				task: {},
				size: 'md',
			},
			global: {
				plugins: [
					buildStore(),
					pinia,
				],
			},
		});
		await flushPromises();
		expect(wrapper.findComponent(Contact).exists()).toBe(true);

		await useSystemSettingsStore(pinia).applyChange({
			name: EngineSystemSettingName.WbtHideContact,
			value: true,
		});
		await nextTick();

		expect(wrapper.findComponent(Contact).exists()).toBe(false);
	});
});
