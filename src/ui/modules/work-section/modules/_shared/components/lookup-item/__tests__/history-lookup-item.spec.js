import { mount,shallowMount } from '@vue/test-utils';
import { CallDirection } from 'webitel-sdk';

import HistoryLookupItem from '../history-lookup-item.vue';

describe('HistoryLookupItem', () => {
  let item;

  beforeEach(() => {
    item = {
      direction: CallDirection.Outbound,
      to: {},
      from: {},
      duration: 60,
    };
  });

  it('renders a component', () => {
    const wrapper = shallowMount(HistoryLookupItem, {
      props: { item },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('emits input event at component click', () => {
    const wrapper = shallowMount(HistoryLookupItem, {
      props: { item },
    });
    wrapper.trigger('click');
    expect(wrapper.emitted().input[0]).toEqual([item]);
  });

  it('calls to inbound call number', () => {
    const mock = vi.fn();
    item.direction = CallDirection.Inbound;
    item.from.number = 'true';
    item.to.number = 'false';

    vi.spyOn(HistoryLookupItem.methods, 'makeCall').mockImplementationOnce(mock);
    const wrapper = mount(HistoryLookupItem, {
      props: { item },
    });
    wrapper.findComponent({ name: 'wt-rounded-action' }).vm.$emit('click');
    expect(mock).toHaveBeenCalledWith({ number: 'true' });
  });

  it('calls to outbound call number', () => {
    const mock = vi.fn();
    item.direction = CallDirection.Outbound;
    item.from.number = 'false';
    item.to.number = 'true';

    vi.spyOn(HistoryLookupItem.methods, 'makeCall').mockImplementationOnce(mock);
    const wrapper = mount(HistoryLookupItem, {
      props: { item },
    });
    wrapper.findComponent({ name: 'wt-rounded-action' }).vm.$emit('click');
    expect(mock).toHaveBeenCalledWith({ number: 'true' });
  });
});
