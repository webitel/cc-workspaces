import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import CurrentChat from '../current-chat.vue';

const chat = {
	messages: [],
};

const store = createStore({
	state: {
		features: {
			chat: {
				chatHistory: {
					chatHistoryMessages: [],
				},
			},
		},
	},
	getters: {
		'features/chat/CHAT_ON_WORKSPACE': () => chat,
		'features/chat/unseen/IS_CHAT_UNSEEN': () => () => false,
		'features/chat/closed/IS_CHAT_ON_WORKSPACE_WAS_CLOSED': () => false,
	},
});

describe('Chat Messages Container', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(CurrentChat, {
			global: {
				plugins: [
					store,
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
	});
});
