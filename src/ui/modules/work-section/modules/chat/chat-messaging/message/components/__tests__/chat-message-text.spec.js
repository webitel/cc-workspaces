import { shallowMount } from '@vue/test-utils';

import ChatMessageText from '../chat-message-text.vue';

let text = {};

describe('ChatMessageText component', () => {
	beforeEach(() => {
		text = '';
	});

	it('renders a component', () => {
		const wrapper = shallowMount(ChatMessageText, {
			props: {
				text,
			},
		});
		expect(wrapper.exists()).toBe(true);
	});
	it('correctly computes message text', () => {
		const text = 'jest';

		const wrapper = shallowMount(ChatMessageText, {
			props: {
				text,
			},
		});
		expect(wrapper.vm.text).toBe(text);
	});
});

describe('ChatMessageText link schemes', () => {
	const render = (text) =>
		shallowMount(ChatMessageText, {
			props: {
				text,
			},
		}).html();

	it('leaves a non-web link as plain text', () => {
		const url = 'smb://attacker.test/share';
		const html = render(`look at ${url} please`);

		expect(html).not.toContain('<a');
		expect(html).toContain(url);
	});

	it('still links a web url', () => {
		expect(render('look at https://example.test/page please')).toContain('<a');
	});
});
