import { shallowMount } from '@vue/test-utils';
import WelcomePopup
  from '../welcome-popup.vue';

describe('WelcomePopup', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(WelcomePopup);
    expect(wrapper.isVisible()).toBe(true);
  });
  it('calls mic check method at component init', () => {
    const mock = jest.fn();
    jest.spyOn(WelcomePopup.methods, 'checkMic')
      .mockImplementationOnce(mock);
    shallowMount(WelcomePopup);
    expect(mock).toHaveBeenCalled();
  });
  it('makes mic request at component init', () => {
    const mock = jest.fn();
    global.navigator.mediaDevices = { getUserMedia: mock };
    shallowMount(WelcomePopup);
    expect(mock).toHaveBeenCalled();
  });
  it('calls notifications check method at component init', () => {
    const mock = jest.fn();
    jest.spyOn(WelcomePopup.methods, 'checkNotifications')
      .mockImplementationOnce(mock);
    shallowMount(WelcomePopup);
    expect(mock).toHaveBeenCalled();
  });
  it('makes notifications request at component init', () => {
    const mock = jest.fn();
    global.Notification = { requestPermission: mock };
    shallowMount(WelcomePopup);
    expect(mock).toHaveBeenCalled();
  });
  it('calls "handleKeypress" method at window keypress event', () => {
    const mock = jest.fn();
    jest.spyOn(WelcomePopup.methods, 'handleKeyPress')
      .mockImplementationOnce(mock);
    shallowMount(WelcomePopup);
    window.dispatchEvent(new Event('keypress', { keyCode: 32 }));
    expect(mock).toHaveBeenCalled();
  });
  it('"input" is emitted at window keypress "space" (32) event', () => {
    const wrapper = shallowMount(WelcomePopup);
    window.dispatchEvent(new Event('keypress', { keyCode: 32 }));
    expect(wrapper.emitted()).toBeTruthy();
  });
});
