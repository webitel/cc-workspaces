import { shallowMount } from '@vue/test-utils';
import { createPinia } from 'pinia';

import ChatMessage from '../chat-message.vue';

vi.mock('../../../../../userinfo/userinfoStore', () => ({
	useUserinfoStore: () => ({
		userInfo: {
			name: 'Agent',
		},
	}),
}));

let message = {};
describe('Chat Message component', () => {
	beforeEach(() => {
		message = {};
	});

	it('renders a component', () => {
		const wrapper = shallowMount(ChatMessage, {
			props: {
				message,
			},
			global: {
				plugins: [
					createPinia(),
				],
			},
		});
		expect(wrapper.exists()).toBe(true);
	});
});
