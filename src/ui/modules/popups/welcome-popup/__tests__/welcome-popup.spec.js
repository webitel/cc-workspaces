import { shallowMount } from '@vue/test-utils';

import WelcomePopup from '../welcome-popup.vue';

describe('WelcomePopup', () => {
	it('renders popup root', () => {
		const wrapper = shallowMount(WelcomePopup);
		expect(wrapper.isVisible()).toBe(true);
		expect(
			wrapper
				.findComponent({
					name: 'wt-popup',
				})
				.exists(),
		).toBe(true);
	});
	it('calls checkMic at component init', () => {
		const mock = vi.fn();
		vi.spyOn(WelcomePopup.methods, 'checkMic').mockImplementationOnce(mock);
		shallowMount(WelcomePopup);
		expect(mock).toHaveBeenCalled();
	});
	it('requests microphone access at component init', () => {
		const mock = vi.fn();
		global.navigator.mediaDevices = {
			getUserMedia: mock,
		};
		shallowMount(WelcomePopup);
		expect(mock).toHaveBeenCalled();
	});
	it('calls checkNotifications at component init', () => {
		const mock = vi.fn();
		vi.spyOn(WelcomePopup.methods, 'checkNotifications').mockImplementationOnce(
			mock,
		);
		shallowMount(WelcomePopup);
		expect(mock).toHaveBeenCalled();
	});
	it('requests notification permission at component init', () => {
		const mock = vi.fn();
		global.Notification = {
			requestPermission: mock,
		};
		shallowMount(WelcomePopup);
		expect(mock).toHaveBeenCalled();
	});
	it('calls handleKeyPress on window keypress event', () => {
		const mock = vi.fn();
		vi.spyOn(WelcomePopup.methods, 'handleKeyPress').mockImplementationOnce(
			mock,
		);
		shallowMount(WelcomePopup);
		window.dispatchEvent(
			new Event('keypress', {
				keyCode: 32,
			}),
		);
		expect(mock).toHaveBeenCalled();
	});
	it('emits input on space keypress event', () => {
		const wrapper = shallowMount(WelcomePopup);
		window.dispatchEvent(
			new Event('keypress', {
				keyCode: 32,
			}),
		);
		expect(wrapper.emitted()).toBeTruthy();
	});
});
