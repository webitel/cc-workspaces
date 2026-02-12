import { shallowMount } from '@vue/test-utils';

import ChatMessageImage from '../chat-message-image.vue';

let file = {};
let type = '';

describe('ChatMessageImage component', () => {
	beforeEach(() => {
		file = {};
		type = '';
	});

	it('renders a component', () => {
		const wrapper = shallowMount(ChatMessageImage, {
			props: {
				file,
				type,
			},
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('correctly computes message with image', () => {
		file = {
			url: '',
		};
		type = 'image/png';

		const wrapper = shallowMount(ChatMessageImage, {
			props: {
				file,
				type,
			},
		});
		expect(wrapper.vm.image).toBeTruthy();
	});
});
