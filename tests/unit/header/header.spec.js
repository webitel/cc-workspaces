import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { AgentStatus } from 'webitel-sdk';
import Header from '../../../src/components/shared/app-header/app-header.vue';
import StatusSelect from '../../../src/components/shared/app-header/status-select.vue';
import BreakPopup from '../../../src/components/break-popup/break-popup.vue';
import TimerPopup from '../../../src/components/break-popup/break-timer-popup.vue';
import statusModule from '../../../src/store/modules/agent-status/agent-status';
import call from '../../../src/store/modules/call/call';
import userinfo from '../../../src/store/modules/userinfo/userinfo';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Header on agent Waiting', () => {
  let state;
  const { getters, actions } = statusModule;
  let store;

  beforeEach(() => {
    state = {
      agent: {
        status: AgentStatus.Waiting,
      },
    };
    actions.AGENT_LOGOUT = jest.fn();
    store = new Vuex.Store({
      modules: {
        call,
        userinfo,
        status: {
          namespaced: true,
          state,
          getters,
          actions,
        },
      },
    });
  });

  it('Doesnt show any popups on default Waiting', () => {
    const wrapper = shallowMount(Header, { store, localVue });
    const breakPopup = wrapper.findComponent(BreakPopup);
    const timerPopup = wrapper.findComponent(TimerPopup);
    expect(breakPopup.isVisible())
      .toBeFalsy();
    expect(timerPopup.isVisible())
      .toBeFalsy();
  });

  // TODO: Fix this test
  it('Shows break popup on setBreak event', () => {
    const wrapper = shallowMount(Header, {
      store,
      localVue,
      data: () => ({ isBreakPopup: true }),
    });
    const breakPopup = wrapper.findComponent(BreakPopup);
    const statusSelect = wrapper.findComponent(StatusSelect);

    statusSelect.vm.$emit('setBreak');

    expect(breakPopup.isVisible())
      .toBeTruthy();
  });

  it('Logs agent out', () => {
    const wrapper = shallowMount(Header, { store, localVue });
    /*
      last switcher is ccenter mode,
      unfortunately, have no other ways
      (except $t label string to discover switcher programmatically)
    */
    const ccenterSwitcher = wrapper.findAllComponents({ name: 'wt-switcher' }).wrappers.pop();
    ccenterSwitcher.vm.$emit('change');
    expect(actions.AGENT_LOGOUT)
      .toHaveBeenCalled();
  });
});

describe('Header on agent Pause', () => {
  let state;
  let store;

  beforeEach(() => {
    state = {
      agent: {
        status: AgentStatus.Pause,
      },
    };
    store = new Vuex.Store({
      modules: {
        call,
        userinfo,
        status: {
          ...statusModule,
          state,
        },
      },
    });
  });

  it('Shows timer popup on Pause state', () => {
    const wrapper = shallowMount(Header, { store, localVue });
    const breakPopup = wrapper.findComponent(BreakPopup);
    const timerPopup = wrapper.findComponent(TimerPopup);
    expect(breakPopup.isVisible())
      .toBeFalsy();
    expect(timerPopup.isVisible())
      .toBeTruthy();
  });
});

describe('Header on agent Offline', () => {
  let state;
  const { getters, actions } = statusModule;
  let store;

  beforeEach(() => {
    state = {
      agent: {
        status: AgentStatus.Offline,
      },
    };
    actions.SET_AGENT_WAITING_STATUS = jest.fn();
    store = new Vuex.Store({
      modules: {
        call,
        userinfo,
        status: {
          namespaced: true,
          state,
          getters,
          actions,
        },
      },
    });
  });

  it('Logs agent in', () => {
    const wrapper = shallowMount(Header, {
      store,
      localVue,
    });
    /*
      last switcher is ccenter mode,
      unfortunately, have no other ways
      (except $t label string to discover switcher programmatically)
    */
    const ccenterSwitcher = wrapper.findAllComponents({ name: 'wt-switcher' }).wrappers.pop();
    ccenterSwitcher.vm.$emit('change');
    expect(actions.SET_AGENT_WAITING_STATUS)
      .toHaveBeenCalled();
  });
});

describe('Agent status getter', () => {
  it('Returns True on Waiting agent state', () => {
    const state = { agent: { status: AgentStatus.Waiting } };
    const isAgent = statusModule.getters.IS_AGENT(state);
    expect(isAgent)
      .toBeTruthy();
  });

  it('Returns True on Pause agent state', () => {
    const state = { agent: { status: AgentStatus.Pause } };
    const isAgent = statusModule.getters.IS_AGENT(state);
    expect(isAgent)
      .toBeTruthy();
  });

  it('Returns False on Offline agent state', () => {
    const state = { agent: { status: AgentStatus.Offline } };
    const isAgent = statusModule.getters.IS_AGENT(state);
    expect(isAgent)
      .toBeFalsy();
  });
});
