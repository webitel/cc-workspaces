import { shallowMount, mount } from '@vue/test-utils';
import MissedQueueContainer
  from '../missed-queue-container.vue';

describe('MissedQueueContainer', () => {
  const loadMissedListMock = vi.spyOn(MissedQueueContainer.methods, 'loadMissedList').mockImplementation(() => {});
  vi.spyOn(MissedQueueContainer.methods, 'resetNewMissed').mockImplementation(() => {});

  it('renders a component', () => {
    const wrapper = shallowMount(MissedQueueContainer, {
      computed: {
        missedList: () => [{ id: 'jest' }],
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
  it('calls loadMissedList on created', () => {
    loadMissedListMock.mockClear();
    shallowMount(MissedQueueContainer, {
      computed: {
        missedList: () => [{ id: 'jest' }],
      },
    });
    expect(loadMissedListMock).toHaveBeenCalled();
  });

  it('calls redial on call preview event', () => {
    const mock = vi.spyOn(MissedQueueContainer.methods, 'redial').mockImplementationOnce(() => {});
    const wrapper = mount(MissedQueueContainer, {
      shallow: true,
      global: {
        stubs: {
          TaskQueueContainer: false,
          MissedQueuePreview: false,
        },
      },
      computed: {
        missedList: () => [{ id: 'jest' }],
        next: () => false,
      },
    });
    wrapper.findComponent({ name: 'missed-queue-preview' }).vm.$emit('call');
    expect(mock).toHaveBeenCalled();
  });

  it('calls hideMissed on hide preview event', () => {
    const mock = vi.spyOn(MissedQueueContainer.methods, 'hideMissed').mockImplementationOnce(() => {});
    const wrapper = mount(MissedQueueContainer, {
      shallow: true,
      global: {
        stubs: {
          TaskQueueContainer: false,
          MissedQueuePreview: false,
        },
      },
      computed: {
        missedList: () => [{ id: 'jest' }],
        next: () => false,
      },
    });
    wrapper.findComponent({ name: 'missed-queue-preview' }).vm.$emit('hide');
    expect(mock).toHaveBeenCalled();
  });
});
