import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import widget from '../../store/widget';
import WidgetBar from '../widget-bar.vue';

const store = createStore({
	modules: {
		ui: {
			modules: {
				widget,
			},
		},
	},
});

describe('WidgetBar', () => {
	it('renders widget bar root and controls', () => {
		const wrapper = shallowMount(WidgetBar, {
			global: {
				plugins: [
					store,
				],
			},
			computed: {
				agent: () => ({}),
				data: () => ({}),
			},
		});
		expect(wrapper.exists()).toBe(true);
		expect(wrapper.find('.widget-bar').exists()).toBe(true);
		expect(wrapper.find('.widgets-controls').exists()).toBe(true);
	});
});
