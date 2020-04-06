import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { CallDirection } from 'webitel-sdk';
import callModule from '../../../../../../src/store/modules/call/call';
import HistoryContainer
  from '../../../../../../src/components/agent-workspace/workspace-section/shared/workspace-history/history-container.vue';
import History
  from '../../../../../../src/components/agent-workspace/workspace-section/shared/workspace-history/history-item.vue';

// import historyAPI through require to override functions with mock
const historyAPI = require('../../../../../../src/api/agent-workspace/history/history');

const localVue = createLocalVue();
localVue.use(Vuex);

const historyList = [
  {
    id: '36',
    name: '180',
    destination: '808',
    direction: CallDirection.Outbound,
  },
];
historyAPI.getAgentHistory = () => historyList;

describe('Agent History functionality', () => {
  const { state, actions, mutations } = callModule;
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        call: {
          namespaced: true,
          state,
          actions,
          mutations,
        },
      },
    });
  });

  it('Fills history list from API', async () => {
    const wrapper = shallowMount(HistoryContainer, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    await wrapper.vm.$nextTick(); // make async call
    await wrapper.vm.$nextTick(); // rerender list
    expect(wrapper.findAll(History).length)
      .toEqual(historyList.length);
  });

  it('Properly fills history with items from list', async () => {
    const wrapper = shallowMount(HistoryContainer, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    await wrapper.vm.$nextTick(); // make async call
    await wrapper.vm.$nextTick(); // rerender list
    const contact = wrapper.find(History);
    expect(contact.vm.item.id)
      .toEqual(historyList[0].id);
  });

  it('Selects history item and sets its number to new number input', async () => {
    const wrapper = shallowMount(HistoryContainer, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    await wrapper.vm.$nextTick(); // make async call
    await wrapper.vm.$nextTick(); // rerender list

    wrapper.find(History).trigger('click');
    expect(state.newCallNumber).toEqual(historyList[0].destination);
  });

  it('Properly displays history item duration', async () => {
    const item = {
      direction: CallDirection.Outbound,
      to: {},
      from: {},
      hangupAt: Date.now(),
      answeredAt: Date.now() - 60 * 10 ** 3,
    };
    const wrapper = shallowMount(History, {
      store,
      localVue,
      stubs: { Icon: true },
      propsData: {
        item,
      },
    });
    expect(wrapper.find(History).text())
      .toContain('00:01:00');
  });
});
