import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import RichTextEditor from '../rich-text-editor.vue';

describe('RichTextEditor', () => {
	it('renders a component', () => {
		const store = createStore({
			modules: {
				ui: {
					namespaced: true,
					modules: {
						appearance: {
							namespaced: true,
							getters: {
								DARK_MODE: () => false,
							},
						},
					},
				},
			},
		});
		const wrapper = shallowMount(RichTextEditor, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.isVisible()).toBe(true);
	});
});
