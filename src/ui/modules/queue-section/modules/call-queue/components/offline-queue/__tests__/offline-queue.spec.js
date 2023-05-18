import { mount } from '@vue/test-utils';
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
      .mockImplementation(mock);
    jest.spyOn(OfflineQueue.methods, 'loadDataList')
      .mockImplementation(jest.fn());
    const wrapper = mount(OfflineQueue, {
      computed,
      shallow: true,
      global: {
        stubs: {
          TaskQueueContainer: false,
          OfflineQueuePreview: false,
        },
      },
    });
    console.info(wrapper.html());
    wrapper.findComponent({ name: 'offline-queue-preview' }).vm.$emit('click');
    expect(mock).toHaveBeenCalled();
  });
});
