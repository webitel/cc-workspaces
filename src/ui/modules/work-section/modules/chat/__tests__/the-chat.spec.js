import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import TheChat from '../the-chat.vue';

const store = createStore();

describe('The Chat', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(TheChat, {
			computed: {
				chat() {
					return {
						id: '1',
						messages: [],
					};
				},
			},
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
	});
});
