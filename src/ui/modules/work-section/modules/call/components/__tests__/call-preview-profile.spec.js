import { shallowMount } from '@vue/test-utils';
import PreviewProfile from '../call-preview-profile.vue';

describe('PreviewProfile', () => {
  const display = 'jest';
  let call;
  const computed = {
    call: () => call,
  };

  beforeEach(() => {
    call = {};
  });

  it('Correctly displays call displayName', () => {
    call.displayName = display;
    const wrapper = shallowMount(PreviewProfile, {
      computed,
    });
    expect(wrapper.find('.preview-profile__name').text()).toEqual(display);
  });

  it('Correctly displays call displayNumber', () => {
    call.displayNumber = display;
    const wrapper = shallowMount(PreviewProfile, {
      computed,
    });
    expect(wrapper.find('.preview-profile__number').text()).toEqual(display);
  });
});
