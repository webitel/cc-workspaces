import { createPinia } from 'pinia';
import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { vi } from 'vitest';

import BreakpointPlugin from '../../../app/plugins/breakpoint.plugin';
import AgentWorkspace from '../the-agent-workspace.vue';

vi.mock('vue-router', () => ({
	useRoute: () => ({
		query: {},
	}),
	useRouter: () => ({
		push: vi.fn(),
		currentRoute: {},
	}),
}));

vi.mock('../../modules/userinfo/userinfoStore', () => ({
	useUserinfoStore: () => ({
		initialize: vi.fn(),
		routeAccessGuard: vi.fn(),
		showUserNotifications: vi.fn(),
	}),
}));

describe('Agent Workspace', () => {
	it('renders workspace container', () => {
		const store = createStore({
			modules: {
				workspace: {
					namespaced: true,
					actions: {
						OPEN_SESSION: vi.fn(),
						CLOSE_SESSION: vi.fn(),
					},
				},
				ui: {
					namespaced: true,
					modules: {
						infoSec: {
							namespaced: true,
							modules: {
								agentInfo: {
									namespaced: true,
									state: {
										agent: {},
									},
									getters: {
										IS_DESC_TRACK_AUTH_POPUPS_ALLOW: () => false,
									},
								},
							},
						},
					},
				},
				features: {
					namespaced: true,
					modules: {
						status: {
							namespaced: true,
							actions: {
								AGENT_LOGOUT: vi.fn(),
							},
						},
					},
				},
			},
		});

		const wrapper = shallowMount(AgentWorkspace, {
			global: {
				plugins: [
					store,
					createPinia(),
					BreakpointPlugin,
				],
			},
		});

		expect(wrapper.find('.main-agent-workspace').exists()).toBe(true);
	});
});
