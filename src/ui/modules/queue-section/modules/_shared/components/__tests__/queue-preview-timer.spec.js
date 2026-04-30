import { shallowMount } from '@vue/test-utils';
import ReactiveNowStoreModule from '@webitel/ui-sdk/src/store/ReactiveNowStoreModule/ReactiveNowStoreModule';
import { createStore } from 'vuex';

import QueuePreviewTimer from '../queue-preview-timer.vue';

const store = createStore({
	modules: {
		now: new ReactiveNowStoreModule().getModule(),
	},
});
const task = {
	createdAt: Date.now(),
};

describe('QueuePreviewTimer', () => {
	it('renders timer root and split digits', () => {
		const wrapper = shallowMount(QueuePreviewTimer, {
			global: {
				plugins: [
					store,
				],
			},
			props: {
				task,
			},
		});
		expect(wrapper.exists()).toBe(true);
		expect(wrapper.find('.queue-preview-timer').exists()).toBe(true);
		expect(
			wrapper.findAll('.queue-preview-timer__digit').length,
		).toBeGreaterThan(0);
	});
});
