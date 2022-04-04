import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { AgentStatus } from 'webitel-sdk';
import StatusSelect from '../../../../src/components/shared/app-header/agent-status-select.vue';
import statusModule from '../../../../src/store/modules/agent-status/agent-status';

const localVue = createLocalVue();
localVue.use(Vuex);

const lastStatusChange = Date.now() - 12 * 60 * 60 * 10 ** 3; // '12:00:00'

describe('Agent Status Select', () => {
  let store;
  let state;
  let getters;
  let actions;
  let agent = {};

  beforeEach(() => {
    agent = {
      status: AgentStatus.Waiting,
      lastStatusChange,
    };
    state = { agent };
    actions = {
      SET_AGENT_WAITING_STATUS: jest.fn(),
      AGENT_LOGOUT: jest.fn(),
    };
    getters = {
      IS_AGENT: statusModule.getters.IS_AGENT,
    };
    store = new Vuex.Store({
      modules: {
        status: {
          namespaced: true,
          state,
          getters,
          actions,
        },
        now: {
          namespaced: true,
          state: {
            now: Date.now(),
          },
        },
      },
    });
  });

  it('renders a component', () => {
    const wrapper = shallowMount(StatusSelect, { store, localVue });
    expect(wrapper.exists()).toBe(true);
  });

  // it('correctly computes statusDuration', () => {
  //   agent.lastStatusChange = Date.now() - 24 * 1000;
  //   const wrapper = shallowMount(StatusSelect, { store, localVue });
  //   expect(wrapper.vm.statusDuration).toBe('00:00:23'); // 24 - 1
  // });
});
