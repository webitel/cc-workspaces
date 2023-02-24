import { shallowMount } from '@vue/test-utils';
import OfflineQueue from '../offline-queue-container.vue';

describe('Members list functionality', () => {
  const member = {};

  const computed = {
    dataList: () => [member],
    taskOnWorkspace: () => ({}),
  };

  it('Opens selected member on workspace', () => {
    const mock = jest.fn();
    jest.spyOn(OfflineQueue.methods, 'toggleMemberDisplay')
      .mockImplementationOnce(mock);
    const wrapper = shallowMount(OfflineQueue, {
      computed,
    });
    wrapper.findComponent({ name: 'offline-queue-preview' }).vm.$emit('click');
    expect(mock).toHaveBeenCalled();
  });
});
