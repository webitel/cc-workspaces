import { flushPromises, shallowMount } from '@vue/test-utils';
import { ConfigurationsAPI } from '@webitel/api-services/api';
import { EngineSystemSettingName } from '@webitel/api-services/gen/models';
import { DefaultWorkspaceTabSettings } from '@webitel/ui-sdk/enums';
import { createPinia } from 'pinia';
import { nextTick, ref } from 'vue';
import { createStore } from 'vuex';
import { CallActions } from 'webitel-sdk';

import { useSystemSettingsStore } from '../../../../../features/modules/system-settings/store/system-settings';
import InfoSectionModule from '../../store/infoSec.js';
import InfoSection from '../the-agent-info-section.vue';

vi.mock('@webitel/api-services/api', () => ({
	ConfigurationsAPI: {
		getList: vi.fn().mockResolvedValue({
			items: [],
		}),
	},
}));

const callOnWorkspace = {
	id: 'call-1',
	state: CallActions.Active,
	allowReporting: true,
};

const mountInfoSection = (overrides = {}) =>
	shallowMount(InfoSection, {
		global: {
			plugins: [
				createStore({
					modules: {
						...InfoSectionModule,
					},
				}),
				createPinia(),
			],
		},
		computed: {
			...InfoSection.computed,
			showFlows: () => false,
			taskOnWorkspace: () => callOnWorkspace,
			...overrides,
		},
	});

describe('InfoSection', () => {
	let store;
	store = createStore({
		modules: {
			...InfoSectionModule,
		},
	});
	it('renders a component', () => {
		const wrapper = shallowMount(InfoSection, {
			global: {
				plugins: [
					store,
					createPinia(),
				],
			},
			computed: {
				...InfoSection.computed,
				showProcessing: () => true,
				showFlows: () => true,
				taskOnWorkspace: () => callOnWorkspace,
			},
		});
		expect(wrapper.isVisible()).toBe(true);
		expect(wrapper.find('.info-section').exists()).toBe(true);
		expect(
			wrapper
				.findComponent({
					name: 'the-agent-info-nav-panel',
				})
				.exists(),
		).toBe(true);
	});

	describe('default tab resolution', () => {
		beforeEach(() => {
			ConfigurationsAPI.getList.mockReset();
			ConfigurationsAPI.getList.mockResolvedValue({
				items: [],
			});
		});

		it('defaults to processing on a call when no system default tab is configured and processing is available', async () => {
			const wrapper = mountInfoSection({
				showProcessing: () => true,
			});
			await flushPromises();

			expect(wrapper.vm.currentTab?.value).toBe('processing');
		});

		it('falls back to clientInfo when no system default tab is configured and processing is not available', async () => {
			const wrapper = mountInfoSection({
				showProcessing: () => false,
			});
			await flushPromises();

			expect(wrapper.vm.currentTab?.value).toBe('client-info');
		});

		it('respects a system-configured default tab over clientInfo', async () => {
			ConfigurationsAPI.getList.mockResolvedValue({
				items: [
					{
						name: EngineSystemSettingName.DefaultWorkspaceTab,
						value: DefaultWorkspaceTabSettings.TaskProcessing,
					},
				],
			});

			const wrapper = mountInfoSection({
				showProcessing: () => true,
			});
			await flushPromises();

			expect(wrapper.vm.currentTab?.value).toBe('processing');
		});

		it('falls back to clientInfo when the system default tab (processing) is not available for this task, e.g. a transferred call', async () => {
			ConfigurationsAPI.getList.mockResolvedValue({
				items: [
					{
						name: EngineSystemSettingName.DefaultWorkspaceTab,
						value: DefaultWorkspaceTabSettings.TaskProcessing,
					},
				],
			});

			const wrapper = mountInfoSection({
				showProcessing: () => false,
			});
			await flushPromises();

			expect(wrapper.vm.currentTab?.value).toBe('client-info');
		});

		it('applies a default tab changed by system settings event from the next task, without switching the current one', async () => {
			const task = ref(callOnWorkspace);
			const pinia = createPinia();
			const wrapper = shallowMount(InfoSection, {
				global: {
					plugins: [
						createStore({
							modules: {
								...InfoSectionModule,
							},
						}),
						pinia,
					],
				},
				computed: {
					...InfoSection.computed,
					showFlows: () => false,
					showProcessing: () => true,
					taskOnWorkspace: () => task.value,
				},
			});
			await flushPromises();
			expect(wrapper.vm.currentTab?.value).toBe('processing');

			await useSystemSettingsStore(pinia).applyChange({
				name: EngineSystemSettingName.DefaultWorkspaceTab,
				value: DefaultWorkspaceTabSettings.ClientInfo,
			});
			await nextTick();
			expect(wrapper.vm.currentTab?.value).toBe('processing');

			task.value = {
				...callOnWorkspace,
				id: 'call-2',
			};
			await nextTick();
			expect(wrapper.vm.currentTab?.value).toBe('client-info');
		});
	});
});
