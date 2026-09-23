import { shallowMount } from '@vue/test-utils';
import { UserPresenceStatus } from '@webitel/ui-sdk/enums';
import { vi } from 'vitest';
import { createStore } from 'vuex';
import UserDndSwitcher from '../user-dnd-switcher.vue';

describe('User Dnd Switcher', () => {
	it('maps dnd status to switcher model value', () => {
		const store = createStore({
			modules: {
				features: {
					namespaced: true,
					modules: {
						status: {
							namespaced: true,
							state: {
								user: {
									status: {
										[UserPresenceStatus.Dnd]: true,
									},
								},
							},
							actions: {
								TOGGLE_USER_DND: vi.fn(),
							},
						},
					},
				},
			},
		});
		const wrapper = shallowMount(UserDndSwitcher, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(
			wrapper
				.findComponent({
					name: 'wt-switcher',
				})
				.props('modelValue'),
		).toBe(true);
	});

	it('dispatches TOGGLE_USER_DND on switch update', async () => {
		const toggleAction = vi.fn();
		const store = createStore({
			modules: {
				features: {
					namespaced: true,
					modules: {
						status: {
							namespaced: true,
							state: {
								user: {
									status: {
										[UserPresenceStatus.Dnd]: false,
									},
								},
							},
							actions: {
								TOGGLE_USER_DND: toggleAction,
							},
						},
					},
				},
			},
		});
		const wrapper = shallowMount(UserDndSwitcher, {
			global: {
				plugins: [
					store,
				],
			},
		});
		await wrapper
			.findComponent({
				name: 'wt-switcher',
			})
			.vm.$emit('update:model-value', true);
		expect(toggleAction).toHaveBeenCalled();
	});
});
