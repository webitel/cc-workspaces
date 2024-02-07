import { mount } from '@vue/test-utils';
import OfflineQueue from '../offline-queue-container.vue';

describe('Members list functionality', () => {
  let member;

  beforeEach(() => {
    member = {
      communications: [
        { destination: '123' },
        { destination: '456' },
      ],
    };
  });

  const computed = {
    dataList: () => [member],
    taskOnWorkspace: () => ({}),
  };

  it('Opens selected member on workspace', () => {
    const mock = vi.fn();
    vi.spyOn(OfflineQueue.methods, 'toggleMemberDisplay')
      .mockImplementation(mock);
    vi.spyOn(OfflineQueue.methods, 'loadDataList')
      .mockImplementation(vi.fn());
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
