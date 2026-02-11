import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import CurrentChat from '../current-chat.vue';

const chat = {
	messages: [],
};

const store = createStore();
describe('Chat Messages Container', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(CurrentChat, {
			global: {
				plugins: [
					store,
				],
			},
			computed: {
				chat() {
					return chat;
				},
			},
		});
		expect(wrapper.exists()).toBe(true);
	});
});
