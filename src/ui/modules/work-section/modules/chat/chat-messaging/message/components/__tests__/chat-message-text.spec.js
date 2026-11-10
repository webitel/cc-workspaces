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

	it.each([
		'smb://attacker.test/share',
		'ms-settings://x',
		'file:///etc/passwd',
	])('leaves %s as plain text', (url) => {
		const html = render(`look at ${url} please`);

		expect(html).not.toContain('<a');
		expect(html).toContain(url);
	});

	it.each([
		'https://example.test/page',
		'http://example.test/page',
	])('still links %s', (url) => {
		expect(render(`look at ${url} please`)).toContain('<a');
	});

	it('does not render markup from the message body', () => {
		expect(render('<img src=x onerror=alert(1)>')).not.toContain('<img');
	});
});
