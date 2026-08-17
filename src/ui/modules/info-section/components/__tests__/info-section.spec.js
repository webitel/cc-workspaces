import { flushPromises, shallowMount } from '@vue/test-utils';
import { ConfigurationsAPI } from '@webitel/api-services/api';
import { DefaultWorkspaceTabSettings } from '@webitel/ui-sdk/enums';
import { createStore } from 'vuex';
import { CallActions } from 'webitel-sdk';

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

		it('defaults to the clientInfo tab on a call when no system default tab is configured, even if processing is available', async () => {
			const wrapper = mountInfoSection({
				showProcessing: () => true,
			});
			await flushPromises();

			expect(wrapper.vm.currentTab?.value).toBe('client-info');
		});

		it('respects a system-configured default tab over clientInfo', async () => {
			ConfigurationsAPI.getList.mockResolvedValue({
				items: [
					{
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
	});
});
