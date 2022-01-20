import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { AgentStatus } from 'webitel-sdk';
import TimerPopup from '../../../../src/components/agent-workspace/popups/break-popup/break-timer-popup.vue';
import Header from '../../../../src/components/shared/app-header/app-header.vue';

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
        userinfo: {
          namespaced: true,
          getters: {
            CHECK_APP_ACCESS: () => () => true,
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

  it('Doesn\'t show popup on Online status', () => {
    state.agent.status = AgentStatus.Online;
    const wrapper = shallowMount(TimerPopup, { store, localVue });
    expect(wrapper.isVisible())
      .toBeFalsy();
  });

  it('Show timer popup on Pause state', () => {
    const wrapper = shallowMount(Header, { store, localVue });
    expect(wrapper.isVisible())
      .toBeTruthy();
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
