import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { CallDirection } from 'webitel-sdk';
import callModule from '../../../../../../src/store/modules/call/call';
import workspaceModule from '../../../../../../src/store/modules/agent-workspace/agent-workspace';
import HistoryContainer
  from '../../../../../../src/components/agent-workspace/workspace-section/shared/workspace-history/history-container.vue';
import History
  from '../../../../../../src/components/agent-workspace/workspace-section/shared/workspace-history/history-item.vue';
import APIRepository from '../../../../../../src/api/APIRepository';
// import { truncateFromEnd } from '../../../../../../src/filters/truncate/truncate';

// import historyAPI through require to override functions with mock
// const historyAPI = require('../../../../../../src/api/agent-workspace/history/HistoryAPIRepository');
const historyAPI = APIRepository.history;

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
    state.callOnWorkspace = { _isNew: true };
    store = new Vuex.Store({
      modules: {
        workspace: workspaceModule,
        call: {
          namespaced: true,
          state,
          actions,
          mutations,
        },
      },
    });
  });

  it('renders a component', async () => {
    const wrapper = shallowMount(HistoryContainer, {
      store,
      localVue,
      stubs: { Icon: true },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('Creates history components from data list', () => {
    const wrapper = shallowMount(HistoryContainer, {
      store,
      localVue,
      stubs: { Icon: true },
      data: () => ({ dataList: historyList, isLoading: false }),
    });
    expect(wrapper.findAllComponents(History).length).toEqual(historyList.length);
  });

  it('Selects history item and sets its number to new number input', async () => {
    const wrapper = shallowMount(HistoryContainer, {
      store,
      localVue,
      stubs: { Icon: true },
      data: () => ({ dataList: historyList, isLoading: false }),
    });
    wrapper.findComponent(History).trigger('click');
    expect(state.callOnWorkspace.newNumber).toEqual(historyList[0].destination);
  });

  it('Properly displays history item duration', async () => {
    const item = {
      direction: CallDirection.Outbound,
      to: {},
      from: {},
      duration: 60,
    };
    const wrapper = shallowMount(History, {
      store,
      localVue,
      stubs: { Icon: true },
      propsData: { item },
    });
    expect(wrapper.findComponent(History).text())
      .toContain('00:01:00');
  });
});
