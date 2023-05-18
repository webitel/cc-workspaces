import { shallowMount, mount } from '@vue/test-utils';
import { CallDirection } from 'webitel-sdk';
import APIRepository from '../../../../../../../../../app/api/APIRepository';
import HistoryLookupItem from '../../../lookup-item/history-lookup-item.vue';
import HistoryContainer from '../history-container.vue';
// import { truncateFromEnd } from '../../../../../../src/filters/truncate/truncate';

// import historyAPI through require to override functions with mock
// const historyAPI = require('../../../../../../src/api/agent-workspace/history/HistoryAPIRepository');
const historyAPI = APIRepository.history;

const historyList = [
  {
    id: '36',
    name: '180',
    destination: '808',
    direction: CallDirection.Outbound,
  },
];
historyAPI.getAgentHistory = () => historyList;

const call = {
  _isNew: true,
};

const computed = {
  call() {
    return call;
  },
};

describe('Agent History functionality', () => {
  it('renders a component', async () => {
    const wrapper = shallowMount(HistoryContainer, {
      computed,
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('Creates history components from data list', () => {
    const wrapper = shallowMount(HistoryContainer, {
      data: () => ({ dataList: historyList, isLoading: false }),
      computed,
    });
    expect(wrapper.findAllComponents({ name: 'history-lookup-item' }).length)
    .toEqual(historyList.length);
  });

  it('Selects history item and sets its number to new number input', async () => {
    const mock = jest.fn();
    jest.spyOn(HistoryContainer.methods, 'setNumber')
    .mockImplementationOnce(mock);
    const wrapper = shallowMount(HistoryContainer, {
      data: () => ({ dataList: historyList, isLoading: false }),
      computed,
    });
    wrapper.findComponent({ name: 'history-lookup-item' }).vm.$emit('input');
    expect(mock)
    .toHaveBeenCalledWith({
      value: historyList[0].destination,
    });
  });

  it('Properly displays history item duration', async () => {
    const item = {
      direction: CallDirection.Outbound,
      to: {},
      from: {},
      duration: 60,
    };
    const wrapper = mount(HistoryLookupItem, {
      props: { item },
    });
    expect(wrapper.text())
    .toContain('00:01:00');
  });
});
