import { mount, shallowMount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { createStore } from 'vuex';
import { CallDirection } from 'webitel-sdk';

import APIRepository from '../../../../../../../../../app/api/APIRepository';
import HistoryLookupItem from '../../../lookup-item/history-lookup-item.vue';
import HistoryContainer from '../history-container.vue';

// import { truncateFromEnd } from '../../../../../../src/filters/truncate/truncate';

// import historyAPI through require to override functions with mock
// const historyAPI = require('../../../../../../src/api/agent-workspace/history/HistoryAPIRepository');
const historyAPI = APIRepository.history;

const historyList = [
	{
		id: '36',
		name: '180',
		destination: '808',
		direction: CallDirection.Outbound,
	},
];
historyAPI.getAgentHistory = () => historyList;

vi.mock('../../../../../../userinfo/userinfoStore', () => ({
	useUserinfoStore: () => ({
		userId: 1,
	}),
}));

const buildStore = () =>
	createStore({
		modules: {
			workspace: {
				namespaced: true,
				getters: {
					WORKSRACE_STATE: () => 'call',
				},
			},
			features: {
				namespaced: true,
				modules: {
					member: {
						namespaced: true,
						getters: {
							MEMBER_ON_WORKSPACE: () => ({
								id: 1,
							}),
						},
					},
					call: {
						namespaced: true,
						getters: {
							CALL_ON_WORKSPACE: () => ({
								_isNew: true,
							}),
							IS_NEW_CALL: () => true,
						},
					},
				},
			},
		},
	});

describe('Agent History functionality', () => {
	it('renders history container', async () => {
		const wrapper = shallowMount(HistoryContainer, {
			global: {
				plugins: [
					buildStore(),
					createPinia(),
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('renders call duration in hh:mm:ss format', async () => {
		const item = {
			id: '1',
			direction: CallDirection.Outbound,
			to: {},
			from: {},
			duration: 60,
			createdAt: `${Date.now()}`,
		};
		const wrapper = mount(HistoryLookupItem, {
			props: {
				item,
			},
		});
		expect(wrapper.text()).toContain('00:01:00');
	});
});
