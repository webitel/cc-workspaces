import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { AgentStatus } from 'webitel-sdk';
import TimerPopup from '../../../../src/components/agent-workspace/popups/break-popup/break-timer-popup.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Break timer popup', () => {
  let state;
  let actions;
  let store;

  beforeEach(() => {
    state = {
      agent: {
        status: AgentStatus.Pause,
        stateDuration: 12 * 60 * 60,
      },
    };
    actions = {
      SET_AGENT_WAITING_STATUS: jest.fn(),
      AGENT_LOGOUT: jest.fn(),
    };
    store = new Vuex.Store({
      modules: {
        status: {
          namespaced: true,
          state,
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

  it('Correctly displays break duration', () => {
    const wrapper = shallowMount(TimerPopup, { store, localVue });
    expect(wrapper.vm.duration)
      .toEqual('12:00:00');
  });

  it('Correctly goes Waiting', () => {
    const wrapper = shallowMount(TimerPopup, { store, localVue });

    wrapper.findAllComponents({ name: 'wt-button' }).at(0).vm.$emit('click');
    expect(actions.SET_AGENT_WAITING_STATUS)
      .toHaveBeenCalled();
  });

  it('Correctly goes Offline', () => {
    const wrapper = shallowMount(TimerPopup, { store, localVue });

    wrapper.findAllComponents({ name: 'wt-button' }).at(1).vm.$emit('click');
    expect(actions.AGENT_LOGOUT)
      .toHaveBeenCalled();
  });
});
