import { mount, shallowMount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { createStore } from 'vuex';

vi.mock('../../../../../../composables/useLoader', () => ({
	useLoader: () => ({
		showLoader: vi.fn(() => false),
		runWithLoader: vi.fn((id, fn) => fn()),
	}),
}));

import MissedQueueContainer from '../missed-queue-container.vue';

const createVuexStore = ({ missedList = [] } = {}) => {
	return createStore({
		modules: {
			features: {
				namespaced: true,
				modules: {
					call: {
						namespaced: true,
						modules: {
							missed: {
								namespaced: true,
								state: {
									missedList,
								},
								actions: {
									INITIALIZE_MISSED: vi.fn(),
									LOAD_NEXT_PAGE: vi.fn(),
									REDIAL: vi.fn(),
									HIDE_MISSED: vi.fn(),
								},
							},
						},
					},
				},
			},
		},
	});
};

const createWrapper = ({
	missedList = [
		{
			id: 'jest',
		},
	],
	shallow = true,
	stubs = {},
} = {}) => {
	const store = createVuexStore({
		missedList,
	});

	vi.spyOn(store, 'dispatch');

	const mountFn = shallow ? shallowMount : mount;

	const wrapper = mountFn(MissedQueueContainer, {
		global: {
			plugins: [
				store,
			],
			stubs: {
				TaskQueueContainer: shallow,
				MissedPreview: shallow,
				LoadMoreButton: shallow,
				WtDivider: true,
				...stubs,
			},
		},
	});

	return {
		wrapper,
		store,
	};
};

describe('MissedQueueContainer', () => {
	it('renders missed queue container root', () => {
		const { wrapper } = createWrapper();

		expect(wrapper.exists()).toBe(true);
		expect(
			wrapper
				.findComponent({
					name: 'task-queue-container',
				})
				.exists(),
		).toBe(true);
	});

	it('calls redial on call preview event', async () => {
		const task = {
			id: 'jest',
		};
		const { wrapper, store } = createWrapper({
			missedList: [
				task,
			],
			shallow: false,
			stubs: {
				TaskQueueContainer: {
					template: '<div><slot /></div>',
				},
				LoadMoreButton: true,
				WtDivider: true,
				MissedPreview: {
					name: 'missed-preview',
					template: '<div @click="$emit(\'call\')"></div>',
				},
			},
		});

		const preview = wrapper.findComponent({
			name: 'missed-preview',
		});

		await preview.trigger('click');

		expect(store.dispatch).toHaveBeenCalledWith(
			'features/call/missed/REDIAL',
			task,
		);
	});

	it('calls hideMissed on hide preview event', async () => {
		const task = {
			id: 'jest',
		};
		const { wrapper, store } = createWrapper({
			missedList: [
				task,
			],
			shallow: false,
			stubs: {
				TaskQueueContainer: {
					template: '<div><slot /></div>',
				},
				LoadMoreButton: true,
				WtDivider: true,
				MissedPreview: {
					name: 'missed-preview',
					template: '<div @click="$emit(\'hide\')"></div>',
				},
			},
		});

		const preview = wrapper.findComponent({
			name: 'missed-preview',
		});
		await preview.trigger('click');

		expect(store.dispatch).toHaveBeenCalledWith(
			'features/call/missed/HIDE_MISSED',
			task,
		);
	});
});
