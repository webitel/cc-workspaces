import { shallowMount } from '@vue/test-utils';
import CallPreview from '../call-preview.vue';

describe('Transfer functionality', () => {
  it('Opens transfer tab from call-preview', () => {
    const wrapper = shallowMount(CallPreview);
    const transferBtn = wrapper.findAllComponents({ name: 'wt-rounded-action' }).at(1);
    transferBtn.vm.$emit('click', {});
    expect(wrapper.emitted().transfer)
      .toBeTruthy();
  });
});

describe('Answer and Hangup functionality', () => {
  it('Answers on call', () => {
    const mock = vi.fn();
    vi.spyOn(CallPreview.methods, 'answer')
      .mockImplementationOnce(mock);

    const wrapper = shallowMount(CallPreview);
    const answerBtn = wrapper.findAllComponents({ name: 'wt-rounded-action' }).at(0);
    answerBtn.vm.$emit('click', {});
    expect(mock).toHaveBeenCalled();
  });

  it('Hangups call', () => {
    const mock = vi.fn();
    vi.spyOn(CallPreview.methods, 'hangup')
        .mockImplementationOnce(mock);

    const wrapper = shallowMount(CallPreview);
    const hangupBtn = wrapper.findAllComponents({ name: 'wt-rounded-action' }).at(2);
    hangupBtn.vm.$emit('click', {});
    expect(mock)
      .toHaveBeenCalled();
  });
});
