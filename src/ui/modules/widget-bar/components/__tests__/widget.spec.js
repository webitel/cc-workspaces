import { shallowMount } from '@vue/test-utils';

import Widget from '../widget.vue';

describe('Widget', () => {
	const widget = {
		icon: 'ws-widget-call-inbound',
		text: vi.fn(),
		locale: 'widget.locale',
	};

	it('renders widget root', () => {
		const wrapper = shallowMount(Widget, {
			props: {
				widget,
			},
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('emits "select" on click when selectionMode is enabled', () => {
		const wrapper = shallowMount(Widget, {
			props: {
				widget,
				selectionMode: true,
			},
		});
		wrapper.find('.widget').trigger('click');
		expect(wrapper.emitted().select).toBeTruthy();
	});

	it('does not emit "select" on click when selectionMode is disabled', () => {
		const wrapper = shallowMount(Widget, {
			props: {
				widget,
				selectionMode: false,
			},
		});
		wrapper.find('.widget').trigger('click');
		expect(wrapper.emitted().select).toBeFalsy();
	});

	it('applies icon suffix to wt-icon', () => {
		const wrapper = shallowMount(Widget, {
			props: {
				widget,
			},
		});
		expect(wrapper.find('.widget-icon').attributes('icon')).toBe(
			'widget-call-inbound',
		);
	});
});
