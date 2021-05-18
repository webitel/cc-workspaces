import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { AgentStatus } from 'webitel-sdk';
import StatusSelect from '../../../../src/components/shared/app-header/user-status-select.vue';
import statusModule from '../../../../src/store/modules/agent-status/agent-status';

const localVue = createLocalVue();
localVue.use(Vuex);

const lastStatusChange = Date.now() - 12 * 60 * 60 * 10 ** 3; // '12:00:00'

describe('Agent Status Select', () => {
  let store;
  let state;
  let getters;
  let actions;

  beforeEach(() => {
    state = {
      agent: {
        status: AgentStatus.Waiting,
        lastStatusChange,
      },
    };
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

  it('Correctly computes Agent status duration', () => {
    const wrapper = shallowMount(StatusSelect, { store, localVue });
    expect(wrapper.vm.duration).toEqual('12:00:00');
  });

  it('Set Agent Pause status', async () => {
    const wrapper = shallowMount(StatusSelect, { store, localVue });
    wrapper.getComponent({ name: 'wt-status-select' }).vm.$emit('change', AgentStatus.Pause);
    expect(wrapper.emitted().setBreak).toBeTruthy();
  });

  it('Set Agent Active status', async () => {
    const wrapper = shallowMount(StatusSelect, { store, localVue });
    wrapper.getComponent({ name: 'wt-status-select' }).vm.$emit('change', AgentStatus.Online);
    expect(actions.SET_AGENT_WAITING_STATUS)
      .toHaveBeenCalled();
  });
});
