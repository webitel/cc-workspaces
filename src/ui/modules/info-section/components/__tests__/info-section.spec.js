import { ConfigurationsAPI } from '@webitel/api-services/api';
import { flushPromises, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { CallActions } from 'webitel-sdk';

import InfoSectionModule from '../../store/infoSec.js';
import InfoSection from '../the-agent-info-section.vue';

vi.mock('@webitel/api-services/api', () => ({
	ConfigurationsAPI: {
		getList: vi.fn(),
	},
}));

const callOnWorkspace = {
	id: 'call-1',
	state: CallActions.Active,
	allowReporting: true,
};

// module providing a real, mutable `callInfo` map, mirroring features/call
const createCallModule = () => ({
	features: {
		namespaced: true,
		modules: {
			call: {
				namespaced: true,
				state: () => ({
					callInfo: new Map(),
				}),
				mutations: {
					UPDATE_CALL_INFO(state, { callId, info }) {
						const existing = state.callInfo.get(callId) || {};
						state.callInfo.set(callId, {
							...existing,
							...info,
						});
					},
				},
			},
		},
	},
});

const mountInfoSection = (bridgeStore, overrides = {}) =>
	shallowMount(InfoSection, {
		global: {
			plugins: [
				bridgeStore,
			],
		},
		computed: {
			...InfoSection.computed,
			showProcessing: () => false,
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

	describe('bridgeInfo watcher', () => {
		beforeEach(() => {
			ConfigurationsAPI.getList.mockReset();
		});

		it('does not force the clientInfo tab on bridge before defaultWorkspaceTab resolves', async () => {
			let resolveSettings;
			ConfigurationsAPI.getList.mockImplementation(
				() =>
					new Promise((resolve) => {
						resolveSettings = resolve;
					}),
			);

			const bridgeStore = createStore({
				modules: {
					...InfoSectionModule,
					...createCallModule(),
				},
			});
			const wrapper = mountInfoSection(bridgeStore);

			// bridge arrives while the DefaultWorkspaceTab request is still pending
			bridgeStore.commit('features/call/UPDATE_CALL_INFO', {
				callId: callOnWorkspace.id,
				info: {
					bridgedId: 'bridge-1',
				},
			});
			await flushPromises();

			expect(wrapper.vm.currentTab).not.toBe(wrapper.vm.tabsObject.clientInfo);

			resolveSettings({
				items: [],
			});
			await flushPromises();
		});

		it('reacts only to a new bridge, not to unrelated callInfo updates', async () => {
			ConfigurationsAPI.getList.mockResolvedValue({
				items: [],
			});

			const bridgeStore = createStore({
				modules: {
					...InfoSectionModule,
					...createCallModule(),
				},
			});
			const wrapper = mountInfoSection(bridgeStore);
			await flushPromises();

			const { clientInfo, generalInfo } = wrapper.vm.tabsObject;

			wrapper.vm.currentTab = generalInfo;
			bridgeStore.commit('features/call/UPDATE_CALL_INFO', {
				callId: callOnWorkspace.id,
				info: {
					bridgedId: 'bridge-1',
				},
			});
			await flushPromises();
			expect(wrapper.vm.currentTab).toBe(clientInfo);

			// operator navigates away manually
			wrapper.vm.currentTab = generalInfo;

			// unrelated update merges into the same callInfo entry, keeping the same bridgedId
			bridgeStore.commit('features/call/UPDATE_CALL_INFO', {
				callId: callOnWorkspace.id,
				info: {
					remoteHold: true,
				},
			});
			await flushPromises();

			expect(wrapper.vm.currentTab).toBe(generalInfo);
		});
	});
});
