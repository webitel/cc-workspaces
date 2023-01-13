import { shallowMount } from '@vue/test-utils';
import { CallDirection } from 'webitel-sdk';
import HistoryLookupItem from '../history-lookup-item.vue';

const call = {
  historyId: '',
};

const computed = {
  call() {
    return call;
  },
};
describe('HistoryLookupItem', () => {
  const item = {
    direction: CallDirection.Outbound,
    to: {},
    from: {},
    duration: 60,
  };

  it('renders a component', () => {
    const wrapper = shallowMount(HistoryLookupItem, {
      propsData: { item },
      computed,
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('emits input event at component click', () => {
    const wrapper = shallowMount(HistoryLookupItem, {
      propsData: { item },
      computed,
    });
    wrapper.trigger('click');
    expect(wrapper.emitted().input[0]).toEqual([item]);
  });
});
