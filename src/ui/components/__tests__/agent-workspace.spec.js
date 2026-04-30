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
	const buildStore = ({
		openSession = vi.fn(),
		closeSession = vi.fn(),
		agentLogout = vi.fn(),
		isDescTrackAuthAllowed = false,
	} = {}) =>
		createStore({
			modules: {
				workspace: {
					namespaced: true,
					actions: {
						OPEN_SESSION: openSession,
						CLOSE_SESSION: closeSession,
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
										IS_DESC_TRACK_AUTH_POPUPS_ALLOW: () =>
											isDescTrackAuthAllowed,
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
								AGENT_LOGOUT: agentLogout,
							},
						},
					},
				},
			},
		});

	it('renders workspace container', () => {
		const store = buildStore();
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

	it('dispatches CLOSE_SESSION on unmount', () => {
		const closeSession = vi.fn();
		const store = buildStore({
			closeSession,
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
		wrapper.unmount();
		expect(closeSession).toHaveBeenCalled();
	});
});
